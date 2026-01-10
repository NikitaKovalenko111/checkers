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

const (
	DefaultType = "default"
	QueenType   = "queen"
)

const (
	FigureTop    = "top"
	FigureBottom = "bottom"
)

const (
	WhiteFigure = "white"
	BlackFigure = "black"
)

const (
	FigureAlive = "alive"
	FigureDead  = "dead"
)

type Position struct {
	XPos int `json:"x"`
	YPos int `json:"y"`
}
