package sessionRepo

import (
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
