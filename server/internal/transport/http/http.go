package http

import (
	"checkers-server/internal/services"
	playerController "checkers-server/internal/transport/http/controllers/player"
	sessionController "checkers-server/internal/transport/http/controllers/session"
	"checkers-server/internal/utils/queue"

	"github.com/gofiber/fiber/v2"
)

type HTTP struct {
	Services    *services.Handlers
	Controllers *Controllers
}

type Controllers struct {
	SessionController *sessionController.SessionController
	PlayerController  *playerController.PlayerController
}

func Init(services *services.Handlers, app fiber.Router, queue *queue.Queue) *HTTP {
	sessionController := sessionController.Init(services.PlayerService, services.SessionService, app, queue)
	playerController := playerController.Init(services.PlayerService, app, queue)

	controllers := Controllers{
		SessionController: sessionController,
		PlayerController:  playerController,
	}

	http := HTTP{
		Services:    services,
		Controllers: &controllers,
	}

	return &http
}

func (http *HTTP) Start() {
	http.Controllers.SessionController.Start("game")
	http.Controllers.PlayerController.Start("player")
}
