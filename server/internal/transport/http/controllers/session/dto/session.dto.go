package sessionControllerDto

type StartGameDto struct {
	Msg string `json:"msg"`
}

type StartGameBodyDto struct {
	PlayerId int `json:"playerId"`
}
