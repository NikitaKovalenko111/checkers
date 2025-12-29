package playerController

import (
	"checkers-server/internal/models"
	playerService "checkers-server/internal/services/player"
	"checkers-server/internal/types"
	"checkers-server/internal/utils/queue"

	"github.com/gofiber/fiber/v2"
)

type PlayerController struct {
	Router        fiber.Router
	PlayerService *playerService.PlayerService
	Queue         *queue.Queue
}

func Init(playerService *playerService.PlayerService, router fiber.Router, queue *queue.Queue) *PlayerController {
	controller := PlayerController{
		PlayerService: playerService,
		Router:        router,
		Queue:         queue,
	}

	return &controller
}

func (controller *PlayerController) CreatePlayer(c *fiber.Ctx) error {
	var player *models.Player

	player, err := controller.PlayerService.CreatePlayer(types.Searching)

	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Some error...")
	}

	return c.Status(fiber.StatusCreated).JSON(*player)
}

func (controller *PlayerController) Start(routerEndpoint string) {
	router := controller.Router.Group(routerEndpoint)

	router.Post("/create", controller.CreatePlayer)
}
