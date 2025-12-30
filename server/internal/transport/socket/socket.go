package socket

import (
	"fmt"
	"net/http"

	"github.com/gofiber/fiber/v2"
	socketio "github.com/googollee/go-socket.io"
)

func SocketStart(app fiber.Router) *socketio.Server {
	io := socketio.NewServer(nil)

	io.OnConnect("/", func(s socketio.Conn) error {
		s.SetContext("")

		_ = s.RemoteHeader()

		fmt.Println("connected:", s.ID())
		return nil
	})

	http.Handle("/socket.io/", io)

	return io
}
