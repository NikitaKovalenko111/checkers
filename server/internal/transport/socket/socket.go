package socket

import (
	"fmt"

	"github.com/gofiber/contrib/socketio"
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
)

func SocketStart(app fiber.Router) {
	ws := app.Group("ws")

	ws.Use(func(c *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(c) {
			c.Locals("allowed", true)
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})

	socketio.On(socketio.EventConnect, func(ep *socketio.EventPayload) {
		fmt.Printf("Connection event 1")

		ep.Kws.SetUUID(ep.Kws.GetStringAttribute("user_id"))
	})

	socketio.On(socketio.EventDisconnect, func(ep *socketio.EventPayload) {
		fmt.Printf("Disconnection event")
	})

	ws.Get("/:id", socketio.New(func(kws *socketio.Websocket) {
		userId := kws.Params("id")
		kws.SetAttribute("user_id", userId)

		kws.Broadcast([]byte("New user connected"), true, socketio.TextMessage)
		kws.Emit([]byte("Hello user!"), socketio.TextMessage)
	}))
}
