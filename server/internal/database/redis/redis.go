package redis

import (
	"checkers-server/internal/config"
	"context"
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
