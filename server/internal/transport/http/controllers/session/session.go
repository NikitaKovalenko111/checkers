package sessionController

import (
	"checkers-server/internal/models"
	playerService "checkers-server/internal/services/player"
	sessionService "checkers-server/internal/services/session"
	sessionControllerDto "checkers-server/internal/transport/http/controllers/session/dto"
	"checkers-server/internal/utils/queue"

	"github.com/gofiber/fiber/v2"
	socketio "github.com/googollee/go-socket.io"
)

type SessionController struct {
	Router         fiber.Router
	PlayerService  *playerService.PlayerService
	SessionService *sessionService.SessionService
	Queue          *queue.Queue
	Io             *socketio.Server
}

func Init(playerService *playerService.PlayerService, sessionService *sessionService.SessionService, router fiber.Router, queue *queue.Queue, io *socketio.Server) *SessionController {
	controller := SessionController{
		PlayerService:  playerService,
		SessionService: sessionService,
		Router:         router,
		Queue:          queue,
	}

	return &controller
}

func (controller *SessionController) Start(routerEndpoint string) {
	router := controller.Router.Group(routerEndpoint)

	router.Post("/start", controller.StartGame)
}

func (controller *SessionController) StartGame(c *fiber.Ctx) error {
	var opponent *models.Player
	var session *models.Session
	player := new(sessionControllerDto.StartGameBodyDto)
	var err error

	if err := c.BodyParser(player); err != nil {
		return c.Status(fiber.StatusBadRequest).SendString(err.Error())
	}

	opponent, err = controller.PlayerService.FindOpponent(player.PlayerId)

	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Some error...")
	}

	if opponent == nil {
		return c.Status(fiber.StatusOK).JSON(sessionControllerDto.StartGameDto{
			Msg: "Waiting for opponent",
		})
	} else {
		session, err = controller.SessionService.CreateSession(player.PlayerId, opponent.Id)

		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}

		return c.Status(fiber.StatusOK).JSON(*session)
	}

}
