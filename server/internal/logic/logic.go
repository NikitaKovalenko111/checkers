package gameLogic

import (
	"checkers-server/internal/models"
	socketTransportDto "checkers-server/internal/transport/socket/dto"
	"checkers-server/internal/types"
	"checkers-server/internal/utils"
	"errors"
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

func checkStepLegitimacy(figureType string, session *models.Session, step *socketTransportDto.StepEventDto) bool {
	neededPlayer := utils.PickCurrentPlayer(step.PlayerId, session)

	if !neededPlayer.StepStatus {
		return false
	}

	isBlocked := checkIfCellIsBlocked(&step.Position, session)

	if isBlocked {
		return false
	}

	if !((step.Position.XPos >= 0 && step.Position.XPos <= 7) && (step.Position.YPos >= 0 && step.Position.YPos <= 7)) {
		return false
	}

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
		if !((stepXPosDelta == 0 && stepYPosDelta != 0) || (stepYPosDelta == 0 && stepXPosDelta != 0)) {
			return false
		} else if stepXPosDelta > stepYPosDelta {
			if step.Position.YPos != (step.Position.XPos - (step.Position.XPos - 1)) {
				return false
			}

			if neededPlayer.Figures[step.FigureId].FigurePosition.YPos != (step.Position.XPos - (step.Position.XPos - 1)) {
				return false
			}
		} else {
			if step.Position.YPos != (step.Position.XPos + (step.Position.YPos - step.Position.XPos)) {
				return false
			}

			if neededPlayer.Figures[step.FigureId].FigurePosition.YPos != (neededPlayer.Figures[step.FigureId].FigurePosition.XPos + (neededPlayer.Figures[step.FigureId].FigurePosition.YPos - step.Position.XPos)) {
				return false
			}
		}

		return true
	}
}

func MakeStep(step *socketTransportDto.StepEventDto, player *models.SessionPlayer, session *models.Session) error {
	isStepLegitimate := checkStepLegitimacy(player.Figures[step.FigureId].FigureType, session, step)

	if !isStepLegitimate {
		return errors.New("the step is not legitimate")
	}

	player.Figures[step.FigureId].FigurePosition = step.Position

	if player.Type == "white" && step.Position.YPos == 7 {
		err := makeCheckerQueen(&player.Figures[step.FigureId])

		if err != nil {
			return errors.New("couldn't make the checker a queen")
		}
	} else if player.Type == "black" && step.Position.YPos == 0 {
		err := makeCheckerQueen(&player.Figures[step.FigureId])

		if err != nil {
			return errors.New("couldn't make the checker a queen")
		}
	}

	return nil
}

func makeCheckerQueen(figure *models.Figure) error {
	figure.FigureType = types.QueenType

	return nil
}
