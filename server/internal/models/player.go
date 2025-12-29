package models

type Player struct {
	Id     int    `json:"id"`
	Status string `json:"status"`
}

type Session struct {
	Id             int `json:"id"`
	FirstPlayerId  int `json:"firstPlayerId"`
	SecondPlayerId int `json:"secondPlayerId"`
}
