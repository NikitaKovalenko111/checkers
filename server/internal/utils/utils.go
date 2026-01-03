package utils

import "checkers-server/internal/models"

func PickCurrentPlayer(playerId int, session *models.Session) *models.SessionPlayer {
	var currentPlayer models.SessionPlayer

	if playerId == session.FirstPlayer.PlayerId {
		currentPlayer = session.FirstPlayer
	} else {
		currentPlayer = session.SecondPlayer
	}

	return &currentPlayer
}
