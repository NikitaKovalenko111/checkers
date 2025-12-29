package services

import (
	storage "checkers-server/internal/database"
	playerService "checkers-server/internal/services/player"
	sessionService "checkers-server/internal/services/session"
	"checkers-server/internal/utils/queue"
)

type Services struct {
	Repos    *storage.Repositories
	Handlers *Handlers
}

type Handlers struct {
	PlayerService  *playerService.PlayerService
	SessionService *sessionService.SessionService
}

func InitServices(repos *storage.Repositories, queue *queue.Queue) *Services {
	playerService := playerService.Init(repos.PlayerRepository, queue)
	sessionService := sessionService.Init(repos.SessionRepository, queue)

	handlers := Handlers{
		PlayerService:  playerService,
		SessionService: sessionService,
	}

	services := Services{
		Repos:    repos,
		Handlers: &handlers,
	}

	return &services
}
