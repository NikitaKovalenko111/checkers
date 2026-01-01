package sessionService

import (
	"checkers-server/internal/database/redis"
	sessionRepo "checkers-server/internal/database/repositories/session"
	"checkers-server/internal/models"
	playerService "checkers-server/internal/services/player"
	"checkers-server/internal/utils/queue"

	"github.com/google/uuid"
)

type SessionService struct {
	SessionRepo   *sessionRepo.SessionRepo
	Redis         *redis.RedisStorage
	PlayerService *playerService.PlayerService
	Queue         *queue.Queue
}

func Init(sessionRepo *sessionRepo.SessionRepo, queue *queue.Queue, redis *redis.RedisStorage, playerService *playerService.PlayerService) *SessionService {
	service := SessionService{
		SessionRepo:   sessionRepo,
		Queue:         queue,
		Redis:         redis,
		PlayerService: playerService,
	}

	return &service
}

func (service *SessionService) CreateSession(playerId int, opponentId int) (*models.Session, error) {
	var session = models.Session{
		Id:             uuid.New(),
		FirstPlayerId:  playerId,
		SecondPlayerId: opponentId,
	}

	err := service.Redis.AddSession(&session)

	// session, err := service.SessionRepo.CreateSession(playerId, opponentId)

	if err != nil {
		return nil, err
	}

	firstPlayer, err := service.PlayerService.FindPlayer(playerId)

	if err != nil {
		return nil, err
	}

	secondPlayer, err := service.PlayerService.FindPlayer(opponentId)

	if err != nil {
		return nil, err
	}

	err = service.Redis.AddPlayer(firstPlayer)

	if err != nil {
		return nil, err
	}

	err = service.Redis.AddPlayer(secondPlayer)

	if err != nil {
		return nil, err
	}

	return &session, nil
}
