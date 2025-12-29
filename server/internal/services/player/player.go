package playerService

import (
	playerRepo "checkers-server/internal/database/repositories/player"
	"checkers-server/internal/models"
	"checkers-server/internal/utils/queue"
	"sync"
)

type PlayerService struct {
	PlayerRepo *playerRepo.PlayerRepo
	Queue      *queue.Queue
}

func Init(playerRepo *playerRepo.PlayerRepo, queue *queue.Queue) *PlayerService {
	service := PlayerService{
		PlayerRepo: playerRepo,
		Queue:      queue,
	}

	return &service
}

func (service *PlayerService) CreatePlayer(status string) (*models.Player, error) {
	player, err := service.PlayerRepo.CreatePlayer(status)

	if err != nil {
		return nil, err
	}

	return player, nil
}

func (service *PlayerService) FindOpponent(playerId int) (*models.Player, error) {
	var opponent *models.Player
	var wg sync.WaitGroup

	wg.Add(1)
	go func() {
		var opponentId int

		defer wg.Done()

		if service.Queue.QueueArray[0] == -1 {
			service.Queue.Add(playerId)

			opponent = nil
		} else {
			opponentId = service.Queue.Read()

			opponent, _ = service.PlayerRepo.FindPlayerById(opponentId)
		}

	}()
	wg.Wait()

	return opponent, nil
}
