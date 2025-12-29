package playerRepo

import (
	"checkers-server/internal/models"
	"checkers-server/internal/types"
	"database/sql"
)

type PlayerRepo struct {
	Db *sql.DB
}

func Init(db *sql.DB) *PlayerRepo {
	repo := PlayerRepo{
		Db: db,
	}

	return &repo
}

func (repo *PlayerRepo) CreatePlayer(status string) (*models.Player, error) {
	var player models.Player

	err := repo.Db.QueryRow(
		"INSERT INTO player (status) VALUES ($1) RETURNING player_id, status",
		status,
	).Scan(&player.Id, &player.Status)

	if err != nil {
		return nil, err
	}

	return &player, nil
}

func (repo *PlayerRepo) RemovePlayer(playerId int) (*models.Player, error) {
	var player models.Player

	err := repo.Db.QueryRow(
		"DELETE FROM player WHERE player_id = $1 RETURNING player_id, status",
		playerId,
	).Scan(&player.Id, &player.Status)

	if err != nil {
		return nil, err
	}

	return &player, nil
}

func (repo *PlayerRepo) FindPlayerById(playerId int) (*models.Player, error) {
	var player models.Player

	err := repo.Db.QueryRow(
		"SELECT player_id, status FROM player WHERE player_id = $1",
		playerId,
	).Scan(&player.Id, &player.Status)

	if err != nil {
		return nil, err
	}

	return &player, nil
}

func (repo *PlayerRepo) FindSearchingPlayer() (*models.Player, error) {
	var player models.Player

	err := repo.Db.QueryRow(
		"SELECT (player_id, status) FROM player WHERE status = $1 LIMIT 1",
		types.Searching,
	).Scan(&player.Id, &player.Status)

	if err != nil {
		return nil, err
	}

	return &player, nil
}
