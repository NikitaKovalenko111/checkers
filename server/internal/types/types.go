package types

const (
	Local = "local"
	Dev   = "dev"
	Prod  = "prod"
)

const (
	Searching = "searching"
	Playing   = "playing"
)

type Position struct {
	XPos int `json:"x"`
	YPos int `json:"y"`
}
