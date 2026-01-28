export type TableType = Array<Array<CellType>>

export type FigureType = {
    figureId: number
    figureType: 'default' | 'queen'
    figureTeam: 'black' | 'white'
    figurePosition: PositionType
    figureStatus: 'alive' | 'dead'
}

export type CellType = {
    cellPosition: PositionType
    containsWay: boolean
    figure: FigureType | null
}

export type WaysType = Array<PositionType>

export const posDefinitions = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

type PositionType = {
    x: number
    y: number
}