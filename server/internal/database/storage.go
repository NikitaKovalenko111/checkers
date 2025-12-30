package storage

import (
	"checkers-server/internal/config"
	"checkers-server/internal/database/redis"
	playerRepo "checkers-server/internal/database/repositories/player"
	sessionRepo "checkers-server/internal/database/repositories/session"
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
)

type Storage struct {
	Db    *sql.DB
	Repos *Repositories
	Redis *redis.RedisStorage
}

type Repositories struct {
	PlayerRepository  *playerRepo.PlayerRepo
	SessionRepository *sessionRepo.SessionRepo
}

func Connect(cfg *config.Config) (*sql.DB, error) {
	connString := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", cfg.Storage.Host, cfg.Storage.Port, cfg.Storage.User, cfg.Storage.Password, cfg.Storage.DBName)

	db, err := sql.Open("postgres", connString)

	if err != nil {
		return nil, err
	}

	return db, nil
}

func InitRepositories(db *sql.DB) *Repositories {
	var repos Repositories

	playerRepo := playerRepo.Init(db)
	sessionRepo := sessionRepo.Init(db)

	repos = Repositories{
		PlayerRepository:  playerRepo,
		SessionRepository: sessionRepo,
	}

	return &repos
}

func InitStorage(db *sql.DB, repos *Repositories, cfg *config.Config) *Storage {
	redis := redis.Init(cfg)
	redis.Connect()

	storage := Storage{
		Db:    db,
		Repos: repos,
		Redis: redis,
	}

	return &storage
}

func (storage *Storage) Prepare() {
	_, err := storage.Db.Exec(
		`
		CREATE TABLE IF NOT EXISTS player (
			player_id SERIAL PRIMARY KEY,
			status VARCHAR(64) NOT NULL
		)
		`,
	)

	if err != nil {
		panic(fmt.Sprintf("%s Error: %s", "Couldn't prepare table player!", err.Error()))
	}

	_, err = storage.Db.Exec(
		`
		CREATE TABLE IF NOT EXISTS game_session (
			session_id SERIAL PRIMARY KEY,
			first_player_id INT REFERENCES player(player_id),
			second_player_id INT REFERENCES player(player_id)
		)
		`,
	)

	if err != nil {
		panic(fmt.Sprintf("%s Error: %s", "Couldn't prepare table game_session!", err.Error()))
	}
}
