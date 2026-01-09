package figures

import (
	"checkers-server/internal/models"
	"checkers-server/internal/types"
)

func MakeDefaultFigures(figuresSide string) *[]models.Figure {
	var figures []models.Figure

	for i := 0; i < 12; i++ {
		figures = append(figures, models.Figure{
			FigureId:     i,
			FigureType:   types.DefaultType,
			FigureStatus: types.FigureAlive,
			FigurePosition: func() types.Position {
				if figuresSide == types.FigureBottom {
					switch i % 3 {
					case 0:
						return types.Position{
							XPos: 0 + (i/3)*2,
							YPos: 0,
						}
					case 1:
						return types.Position{
							XPos: 0 + (i/3)*2,
							YPos: 2,
						}
					case 2:
						return types.Position{
							XPos: 1 + (i/3)*2,
							YPos: 1,
						}
					}
				} else {
					switch i % 3 {
					case 0:
						return types.Position{
							XPos: 7 - (i/3)*2,
							YPos: 7,
						}
					case 1:
						return types.Position{
							XPos: 7 - (i/3)*2,
							YPos: 5,
						}
					case 2:
						return types.Position{
							XPos: 7 - (i/3)*2 - 1,
							YPos: 6,
						}
					}
				}

				return types.Position{}
			}(),
		})
	}

	return &figures
}
