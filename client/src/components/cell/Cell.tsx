import type { JSX } from "react";
import type React from "react";
import cn from 'classnames'
import { posDefinitions, type CellType, type FigureType, type TableType } from "../../types";

type PropsType = {
    figureStatus: 'figure' | 'nofigure'
    figure: null | FigureType
    position: {
        x: number
        y: number
    } | null
    cellIndex: number
    isBlack: boolean
    showWay: boolean
    setTable: (table: TableType) => void
    waysHandler: (cell: CellType) => TableType
}

const Cell: React.FC<PropsType> = ({ position, figureStatus, figure, cellIndex, isBlack, setTable, showWay, waysHandler }): JSX.Element => {
    const handleClick = () => {
        if (!showWay) {
            const newTable = waysHandler({
                cellPosition: position != null ? position : {
                    x: -1,
                    y: -1
                },
                containsWay: showWay,
                figure: figure
            })

            setTable(newTable)
        } else {

        }
    }

    return (
        <div onClick={handleClick} data-x={position?.x} data-y={position?.y} className={cn(
            'table__cell',
            { 'table__cell--show-way': showWay },
            { 'table__cell--figure-default': figureStatus == 'figure' && figure?.figureType == 'default' },
            { 'table__cell--figure-queen': figureStatus == 'figure' && figure?.figureType == 'queen' },
            { 'table__cell--angle-top-left': cellIndex == 1 },
            { 'table__cell--angle-top-right': cellIndex == 8 },
            { 'table__cell--angle-bottom-left': cellIndex == 50 },
            { 'table__cell--angle-bottom-right': cellIndex == 57 },
            { 'table__cell--color-black': isBlack },
            { 'table__cell--is-white-figure': figure?.figureTeam == 'white' }
        )}>
            <span className="table__cell-definition">{position != null ? posDefinitions[position.x] : ''}{position != null ? 8 - position.y : ''}</span>
        </div>
    )
}

export default Cell