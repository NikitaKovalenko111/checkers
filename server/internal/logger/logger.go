package logger

import (
	"checkers-server/internal/config"
	"checkers-server/internal/types"
	"log/slog"
	"os"

	"github.com/lmittmann/tint"
)

func InitLogger(cfg *config.Config) *slog.Logger {
	var level slog.Leveler

	switch cfg.Env {
	case types.Local:
		level = slog.LevelDebug
	case types.Dev:
		level = slog.LevelDebug
	case types.Prod:
		level = slog.LevelInfo
	}

	logger := slog.New(tint.NewHandler(os.Stdout, &tint.Options{
		Level:     level,
		AddSource: true,
	}))

	return logger
}
