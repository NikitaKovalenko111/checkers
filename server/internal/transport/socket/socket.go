package socket

import (
	"checkers-server/internal/database/redis"
	socketTransportDto "checkers-server/internal/transport/socket/dto"
	"fmt"
	"log/slog"
	"strconv"
	"sync"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/adaptor"
	"github.com/google/uuid"
	socketio "github.com/googollee/go-socket.io"
)

func SocketStart(app fiber.Router, socketMap *sync.Map, logger *slog.Logger, redis *redis.RedisStorage) (*socketio.Server, error) {
	io := socketio.NewServer(nil)

	io.OnConnect("/", func(s socketio.Conn) error {
		s.SetContext("")

		headers := s.RemoteHeader()
		uid, err := strconv.Atoi(headers.Get("userId"))

		if err != nil {
			return err
		}

		logger.Info("new connection", slog.String("uid", headers.Get("userId")), slog.String("id", s.ID()))

		socketMap.Store(uid, s)

		return nil
	})

	io.OnDisconnect("/", func(c socketio.Conn, s string) {
		c.SetContext("")

		headers := c.RemoteHeader()
		uid, err := strconv.Atoi(headers.Get("userId"))

		if err != nil {
			panic(err)
		}

		logger.Info("disconnected", slog.String("uid", headers.Get("userId")), slog.String("id", c.ID()))

		socketMap.Delete(uid)
	})

	io.OnEvent("/", "step", func(c socketio.Conn, step socketTransportDto.StepEventDto) {
		sessionUUID, err := uuid.Parse(step.SessionId)

		if err != nil {
			logger.Error("couldn't parse id to uuid")
		}

		session, err := redis.GetSession(sessionUUID)

		if err != nil {
			logger.Error(err.Error())
		}

		if step.PlayerId == session.FirstPlayer.PlayerId {
			session.FirstPlayer.Figures[step.FigureId].FigurePosition = step.Position
		} else {
			session.SecondPlayer.Figures[step.FigureId].FigurePosition = step.Position
		}

		redis.SetSession(session)

		io.BroadcastToRoom("/", fmt.Sprintf("session/%s", step.SessionId), "newStep", *session)
	})

	go func() {
		if err := io.Serve(); err != nil {
			panic(err.Error())
		}
	}()

	app.Get("/socket.io/*", adaptor.HTTPHandler(io))

	return io, nil
}
