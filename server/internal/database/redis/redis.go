package redis

import (
	"checkers-server/internal/config"
	"checkers-server/internal/models"
	"context"
	"encoding/json"
	"strconv"

	"github.com/google/uuid"
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

func (s *RedisStorage) AddPlayer(player *models.Player) error {
	ctx := context.Background()

	jsonPlayer, err := json.Marshal(*player)

	if err != nil {
		return err
	}

	err = s.rdb.Set(ctx, strconv.Itoa(player.Id), jsonPlayer, 0).Err()

	if err != nil {
		return err
	}

	return nil
}

func (s *RedisStorage) GetPlayer(playerId int) (*models.Player, error) {
	ctx := context.Background()

	player, err := s.rdb.Get(ctx, strconv.Itoa(playerId)).Result()

	if err != nil {
		return nil, err
	}

	var parsedPlayer models.Player

	err = json.Unmarshal([]byte(player), &parsedPlayer)

	if err != nil {
		return nil, err
	}

	return &parsedPlayer, nil
}

func (s *RedisStorage) RemovePlayer(playerId int) error {
	ctx := context.Background()

	err := s.rdb.Del(ctx, strconv.Itoa(playerId)).Err()

	if err != nil {
		return err
	}

	return nil
}

func (s *RedisStorage) AddSession(session *models.Session) error {
	ctx := context.Background()

	jsonSession, err := json.Marshal(*session)

	if err != nil {
		return err
	}

	err = s.rdb.Set(ctx, session.Id.String(), jsonSession, 0).Err()

	if err != nil {
		return err
	}

	return nil
}

func (s *RedisStorage) GetSession(sessionId uuid.UUID) (*models.Session, error) {
	ctx := context.Background()

	session, err := s.rdb.Get(ctx, sessionId.String()).Result()

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

func (s *RedisStorage) RemoveSession(sessionId uuid.UUID) error {
	ctx := context.Background()

	err := s.rdb.Del(ctx, sessionId.String()).Err()

	if err != nil {
		return err
	}

	return nil
}
