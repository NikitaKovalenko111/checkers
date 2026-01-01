package socket

import (
	socketTransportDto "checkers-server/internal/transport/socket/dto"
	"fmt"
	"log/slog"
	"strconv"
	"sync"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/adaptor"
	socketio "github.com/googollee/go-socket.io"
)

func SocketStart(app fiber.Router, socketMap *sync.Map, logger *slog.Logger) (*socketio.Server, error) {
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

	io.OnEvent("/", "step", func(c socketio.Conn, pos socketTransportDto.StepEventDto) {
		io.BroadcastToRoom("/", fmt.Sprintf("session/%s", pos.SessionId), "newStep", pos.Position)
	})

	go func() {
		if err := io.Serve(); err != nil {
			panic(err.Error())
		}
	}()

	app.Get("/socket.io/*", adaptor.HTTPHandler(io))

	return io, nil
}
