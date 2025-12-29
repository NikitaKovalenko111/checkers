package sessionRepo

import (
	"checkers-server/internal/models"
	"database/sql"
)

type SessionRepo struct {
	Db *sql.DB
}

func Init(db *sql.DB) *SessionRepo {
	repo := SessionRepo{
		Db: db,
	}

	return &repo
}

func (repo *SessionRepo) CreateSession(firstPlayerId int, secondPlayerId int) (*models.Session, error) {
	var session models.Session

	err := repo.Db.QueryRow(
		"INSERT INTO game_session (first_player_id, second_player_id) VALUES ($1, $2) RETURNING session_id, first_player_id, second_player_id",
		firstPlayerId,
		secondPlayerId,
	).Scan(&session.Id, &session.FirstPlayerId, &session.SecondPlayerId)

	if err != nil {
		return nil, err
	}

	return &session, nil
}
