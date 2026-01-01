package playerService

import (
	playerRepo "checkers-server/internal/database/repositories/player"
	"checkers-server/internal/models"
	"checkers-server/internal/utils/queue"
	"sync"
)

type PlayerService struct {
	playerRepo *playerRepo.PlayerRepo
	queue      *queue.Queue
}

func Init(playerRepo *playerRepo.PlayerRepo, queue *queue.Queue) *PlayerService {
	service := PlayerService{
		playerRepo: playerRepo,
		queue:      queue,
	}

	return &service
}

func (service *PlayerService) CreatePlayer(status string) (*models.Player, error) {
	player, err := service.playerRepo.CreatePlayer(status)

	if err != nil {
		return nil, err
	}

	return player, nil
}

func (service *PlayerService) FindPlayer(playerId int) (*models.Player, error) {
	player, err := service.playerRepo.FindPlayerById(playerId)

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

		if service.queue.QueueArray[0] == -1 {
			service.queue.Add(playerId)

			opponent = nil
		} else {
			opponentId = service.queue.Read()

			opponent, _ = service.playerRepo.FindPlayerById(opponentId)
		}

	}()
	wg.Wait()

	return opponent, nil
}
