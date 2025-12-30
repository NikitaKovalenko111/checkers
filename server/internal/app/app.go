package app

import (
	"checkers-server/internal/config"
	storage "checkers-server/internal/database"
	"checkers-server/internal/logger"
	"checkers-server/internal/services"
	"checkers-server/internal/transport/http"
	"checkers-server/internal/transport/socket"
	"checkers-server/internal/utils/queue"

	"github.com/gofiber/fiber/v2"
)

func Run() {
	cfg := config.InitConfig()

	app := fiber.New(fiber.Config{
		StrictRouting: true,
		ReadTimeout:   cfg.HTTPServer.Timeout,
		IdleTimeout:   cfg.HTTPServer.Idle_timeout,
	})

	logger := logger.InitLogger(cfg)

	logger.Info("Logger is started...")
	logger.Debug("Debug level is enabled...")

	db, err := storage.Connect(cfg)

	if err != nil {
		panic(err)
	}

	repos := storage.InitRepositories(db)
	storage := storage.InitStorage(db, repos, cfg)

	logger.Info("Successfully connected to database!")

	queue := queue.Queue{}
	queue.Init()

	services := services.InitServices(storage.Repos, &queue)

	logger.Info("Successfully inited all services!")

	io := socket.SocketStart(app)

	controllers := http.Init(services.Handlers, app, &queue, io)

	controllers.Start()

	app.Listen(cfg.HTTPServer.Address)
}
