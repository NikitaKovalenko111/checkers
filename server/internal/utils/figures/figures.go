package figures

import (
	"checkers-server/internal/models"
	"checkers-server/internal/types"
)

func MakeDefaultFigures(figuresSide string) *[]models.Figure {
	var figures []models.Figure
	var figuresSideInt int

	if figuresSide == types.FigureBottom {
		figuresSideInt = 1
	} else {
		figuresSideInt = -1
	}

	for i := 0; i < 12; i++ {
		figures = append(figures, models.Figure{
			FigureId:   i,
			FigureType: types.DefaultType,
			FigurePosition: func() types.Position {
				switch i % 3 {
				case 0:
					return types.Position{
						XPos: 0 + (i / 3),
						YPos: 0,
					}
				case 1:
					return types.Position{
						XPos: 0 + (i / 3),
						YPos: 2,
					}
				case 2:
					return types.Position{
						XPos: 1 + (i / 3),
						YPos: 1,
					}
				}
			}(),
		})
	}
}
