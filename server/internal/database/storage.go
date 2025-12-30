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

	storage := Storage{
		Db:    db,
		Repos: repos,
		Redis: redis,
	}

	return &storage
}
