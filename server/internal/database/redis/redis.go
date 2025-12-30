package redis

import (
	"checkers-server/internal/config"
	"checkers-server/internal/models"
	"context"
	"encoding/json"
	"strconv"

	"github.com/redis/go-redis/v9"
)

type RedisStorage struct {
	cfg *config.Redis
	rdb *redis.Client
}

func Init(cfg *config.Config) *RedisStorage {
	return &RedisStorage{
		cfg: &cfg.Redis,
		rdb: nil,
	}
}

func (s *RedisStorage) Connect() {
	rdb := redis.NewClient(&redis.Options{
		Addr:     s.cfg.Addr,
		Password: s.cfg.Password,
		DB:       s.cfg.Db,
	})

	s.rdb = rdb
}

func (s *RedisStorage) AddSocketConnection(socketId string, userId int) error {
	ctx := context.Background()

	err := s.rdb.Set(ctx, strconv.Itoa(userId), socketId, 0).Err()

	if err != nil {
		return err
	}

	return nil
}

func (s *RedisStorage) GetSocketConnection(userId int) (*string, error) {
	ctx := context.Background()

	socketId, err := s.rdb.Get(ctx, strconv.Itoa(userId)).Result()

	if err != nil {
		return nil, err
	}

	return &socketId, nil
}

func (s *RedisStorage) RemoveSocketConnection(userId int) error {
	ctx := context.Background()

	err := s.rdb.Del(ctx, strconv.Itoa(userId)).Err()

	if err != nil {
		return err
	}

	return nil
}

func (s *RedisStorage) AddSession(session *models.Session) error {
	ctx := context.Background()

	err := s.rdb.Set(ctx, strconv.Itoa(session.Id), session, 0).Err()

	if err != nil {
		return err
	}

	return nil
}

func (s *RedisStorage) GetSession(sessionId int) (*models.Session, error) {
	ctx := context.Background()

	session, err := s.rdb.Get(ctx, strconv.Itoa(sessionId)).Result()

	if err != nil {
		return nil, err
	}

	var parsedSession models.Session
	err = json.Unmarshal([]byte(session), &parsedSession)

	if err != nil {
		return nil, err
	}

	return &parsedSession, nil
}
