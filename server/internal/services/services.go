package services

import (
	storage "checkers-server/internal/database"
	"checkers-server/internal/database/redis"
	playerService "checkers-server/internal/services/player"
	sessionService "checkers-server/internal/services/session"
	socketService "checkers-server/internal/services/socket"
	"checkers-server/internal/utils/queue"
	"sync"

	socketio "github.com/googollee/go-socket.io"
)

type Services struct {
	Repos    *storage.Repositories
	Handlers *Handlers
}

type Handlers struct {
	PlayerService  *playerService.PlayerService
	SessionService *sessionService.SessionService
	SocketService  *socketService.SocketService
}

func InitServices(repos *storage.Repositories, queue *queue.Queue, redis *redis.RedisStorage, io *socketio.Server, socketMap *sync.Map) *Services {
	playerService := playerService.Init(repos.PlayerRepository, queue)
	sessionService := sessionService.Init(repos.SessionRepository, queue, redis, playerService)
	socketService := socketService.Init(socketMap, io)

	handlers := Handlers{
		PlayerService:  playerService,
		SessionService: sessionService,
		SocketService:  socketService,
	}

	services := Services{
		Repos:    repos,
		Handlers: &handlers,
	}

	return &services
}
