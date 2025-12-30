package config

import (
	"os"
	"time"

	"github.com/ilyakaznacheev/cleanenv"
	"github.com/joho/godotenv"
)

type Config struct {
	Env        string     `yaml:"env" env-required:"true"`
	HTTPServer HTTPServer `yaml:"http_server"`
	Storage    Storage    `yaml:"storage"`
	Redis      Redis      `yaml:"redis"`
}

type HTTPServer struct {
	Address      string        `yaml:"address" env-default:"3001"`
	Timeout      time.Duration `yaml:"timeout" env-default:"5s"`
	Idle_timeout time.Duration `yaml:"idle_timeout" env-default:"60s"`
}

type Redis struct {
	Addr     string `yaml:"addr" env-default:"localhost:6379"`
	Password string `yaml:"password" env-default:""`
	Db       int    `yaml:"db" env-default:"0"`
}

type Storage struct {
	Port     int    `yaml:"db_port" env-default:"5432"`
	Host     string `yaml:"db_host" env-required:"true"`
	Password string `yaml:"db_password" env-required:"true"`
	User     string `yaml:"db_user" env-required:"true"`
	DBName   string `yaml:"db_name" env-required:"true"`
}

func InitConfig() *Config {
	var cfg Config

	err := godotenv.Load()

	if err != nil {
		panic("Some error appeared while loading env...")
	}

	path, exists := os.LookupEnv("CONFIG_PATH")

	if !exists {
		panic("CONFIG_PATH is not set...")
	}

	err = cleanenv.ReadConfig(path, &cfg)

	if err != nil {
		panic(err)
	}

	return &cfg
}
