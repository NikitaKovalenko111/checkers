package gameLogic

import (
	"checkers-server/internal/models"
	socketTransportDto "checkers-server/internal/transport/socket/dto"
	"checkers-server/internal/types"
	"checkers-server/internal/utils"
)

func checkIfCellIsBlocked(pos *types.Position, session *models.Session) bool {
	var allFigures []models.Figure

	allFigures = append(allFigures, session.FirstPlayer.Figures...)
	allFigures = append(allFigures, session.SecondPlayer.Figures...)

	for i := 0; i < len(allFigures); i++ {
		if allFigures[i].FigurePosition.XPos == pos.XPos && allFigures[i].FigurePosition.YPos == pos.YPos {
			return true
		}
	}

	return false
}

func CheckStepLegitimacy(figureType string, session *models.Session, step *socketTransportDto.StepEventDto) bool {
	isBlocked := checkIfCellIsBlocked(&step.Position, session)

	if isBlocked {
		return false
	}

	if !((step.Position.XPos >= 0 && step.Position.XPos <= 7) && (step.Position.YPos >= 0 && step.Position.YPos <= 7)) {
		return false
	}

	neededPlayer := utils.PickCurrentPlayer(step.PlayerId, session)

	stepXPosDelta := step.Position.XPos - neededPlayer.Figures[step.FigureId].FigurePosition.XPos
	stepYPosDelta := step.Position.YPos - neededPlayer.Figures[step.FigureId].FigurePosition.YPos

	if figureType == types.DefaultType {
		if stepYPosDelta <= 0 {
			return false
		}

		if stepXPosDelta > 1 || stepYPosDelta > 1 {
			return false
		}

		if stepXPosDelta != stepYPosDelta {
			return false
		}

		return true
	} else {
		if stepXPosDelta > stepYPosDelta {

		}

		return true
	}
}
