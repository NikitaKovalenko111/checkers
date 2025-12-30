package socket

import (
	"checkers-server/internal/database/redis"
	"fmt"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/adaptor"
	socketio "github.com/googollee/go-socket.io"
)

func SocketStart(app fiber.Router, redis *redis.RedisStorage) (*socketio.Server, error) {
	io := socketio.NewServer(nil)

	io.OnConnect("/", func(s socketio.Conn) error {
		s.SetContext("")

		headers := s.RemoteHeader()
		uid, err := strconv.Atoi(headers.Get("userId"))

		if err != nil {
			return err
		}

		fmt.Println("uid:", uid)

		err = redis.AddSocketConnection(s.ID(), uid)

		if err != nil {
			return err
		}

		fmt.Println("connected:", s.ID())
		return nil
	})

	go func() {
		if err := io.Serve(); err != nil {
			panic(err.Error())
		}
	}()

	app.Get("/socket.io/*", adaptor.HTTPHandler(io))

	return io, nil
}
