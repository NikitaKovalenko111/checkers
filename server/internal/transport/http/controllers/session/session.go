package sessionController

import (
	"checkers-server/internal/models"
	playerService "checkers-server/internal/services/player"
	sessionService "checkers-server/internal/services/session"
	socketService "checkers-server/internal/services/socket"
	sessionControllerDto "checkers-server/internal/transport/http/controllers/session/dto"
	"checkers-server/internal/utils/queue"
	"fmt"
	"log/slog"
	"strconv"

	"github.com/gofiber/fiber/v2"
	socketio "github.com/googollee/go-socket.io"
)

type SessionController struct {
	Router         fiber.Router
	PlayerService  *playerService.PlayerService
	SessionService *sessionService.SessionService
	SocketService  *socketService.SocketService
	Queue          *queue.Queue
	Io             *socketio.Server
	Logger         *slog.Logger
}

func Init(playerService *playerService.PlayerService, socketService *socketService.SocketService, sessionService *sessionService.SessionService, router fiber.Router, queue *queue.Queue, io *socketio.Server, logger *slog.Logger) *SessionController {
	controller := SessionController{
		PlayerService:  playerService,
		SessionService: sessionService,
		SocketService:  socketService,
		Router:         router,
		Queue:          queue,
		Io:             io,
		Logger:         logger,
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

		firstPlayerConn, err := controller.SocketService.FindUserSocket(opponent.Id)

		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}

		secondPlayerConn, err := controller.SocketService.FindUserSocket(player.PlayerId)

		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}

		controller.Io.JoinRoom("", fmt.Sprintf("session/%s", session.Id.String()), *firstPlayerConn)
		controller.Io.JoinRoom("", fmt.Sprintf("session/%s", session.Id.String()), *secondPlayerConn)

		controller.Io.BroadcastToRoom("/", fmt.Sprintf("session/%s", session.Id.String()), "sessionStarted", session)

		controller.Logger.Info("new session", slog.String("id", session.Id.String()), slog.String("firstPlayerId", strconv.Itoa(opponent.Id)), slog.String("secondPlayerId", strconv.Itoa(player.PlayerId)))

		return c.Status(fiber.StatusOK).JSON(*session)
	}

}
