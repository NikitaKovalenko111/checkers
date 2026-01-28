import type { CellType, FigureType, TableType, WaysType } from "../types";

type ShowWaysFuncType = (currentCell: CellType) => TableType

export const renderTable = (figures: Array<FigureType>): TableType => {
    const table: TableType = []

    for (let row = 0; row < 8; row++) {
        table.push([])

        for (let col = 0; col < 8; col++) {
            const cell: CellType = {
                cellPosition: {
                    x: col,
                    y: row
                },
                containsWay: false,
                figure: null
            }

            table[row].push(cell)
        }
    }

    figures.forEach(figure => {
        if (figure.figureStatus == 'alive') {
            table[figure.figurePosition.y][figure.figurePosition.x].figure = figure
        }
    })

    return table
}

const findWays = (table: TableType, currentCell: CellType): WaysType => {
    const ways: WaysType = []

    if (currentCell.figure?.figureType == 'default') {
        const deltaY = currentCell.figure.figureTeam == 'black' ? -1 : 1

        if ((currentCell.cellPosition.y + deltaY < 8 && currentCell.cellPosition.y + deltaY >= 0) && (currentCell.cellPosition.x + 1 < 8 && currentCell.cellPosition.x + 1 >= 0) && table[currentCell.cellPosition.y + deltaY][currentCell.cellPosition.x + 1].figure == null) {
            ways.push({
                x: currentCell.cellPosition.x + 1,
                y: currentCell.cellPosition.y + deltaY
            })
        }

        if ((currentCell.cellPosition.y + deltaY < 8 && currentCell.cellPosition.y + deltaY >= 0) && (currentCell.cellPosition.x - 1 < 8 && currentCell.cellPosition.x - 1 >= 0) && table[currentCell.cellPosition.y + deltaY][currentCell.cellPosition.x - 1].figure == null) {
            ways.push({
                x: currentCell.cellPosition.x - 1,
                y: currentCell.cellPosition.y + deltaY
            })
        }
    } else if (currentCell.figure?.figureType == 'queen') {
        const linealFn = (x: number) => x + (currentCell.cellPosition.y - currentCell.cellPosition.x)
        const linealFnRev = (x: number) => -x + (currentCell.cellPosition.y + currentCell.cellPosition.x)

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if ((row == linealFn(col) || row == linealFnRev(col)) && table[row][col].figure == null) {
                    ways.push({
                        x: col,
                        y: row
                    })
                }
            }
        }
    }

    return ways
}

export const cellClickHandler = (table: TableType): ShowWaysFuncType => {
    return (currentCell: CellType): TableType => {
        const ways = findWays(table, currentCell)
        const newTable = [...table]

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                newTable[row][col].containsWay = false
            }
        }

        ways.forEach(way => {
            console.log(way);

            newTable[way.y][way.x].containsWay = true
        })

        return newTable
    }
}