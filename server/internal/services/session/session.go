package sessionService

import (
	sessionRepo "checkers-server/internal/database/repositories/session"
	"checkers-server/internal/models"
	"checkers-server/internal/utils/queue"
)

type SessionService struct {
	SessionRepo *sessionRepo.SessionRepo
	Queue       *queue.Queue
}

func Init(sessionRepo *sessionRepo.SessionRepo, queue *queue.Queue) *SessionService {
	service := SessionService{
		SessionRepo: sessionRepo,
		Queue:       queue,
	}

	return &service
}

func (service *SessionService) CreateSession(playerId int, opponentId int) (*models.Session, error) {
	var session *models.Session

	session, err := service.SessionRepo.CreateSession(playerId, opponentId)

	if err != nil {
		return nil, err
	}

	return session, nil
}
