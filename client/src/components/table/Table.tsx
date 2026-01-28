import { useEffect, useState, type JSX } from "react";
import type React from "react";
import Cell from "../cell/Cell";
import type { FigureType, TableType } from "../../types";
import { cellClickHandler, renderTable } from "../../logic/logic";
import cn from 'classnames'

type PropsType = {}

const Table: React.FC<PropsType> = ({ }): JSX.Element => {
    const team = 'white'

    const figures: Array<FigureType> = [
        {
            "figureId": 0,
            "figureTeam": "white",
            "figureType": "default",
            "figurePosition": {
                "x": 0,
                "y": 0
            },
            "figureStatus": "alive"
        },
        {
            "figureId": 1,
            "figureTeam": "white",
            "figureType": "default",
            "figurePosition": {
                "x": 0,
                "y": 2
            },
            "figureStatus": "alive"
        },
        {
            "figureId": 2,
            "figureTeam": "white",
            "figureType": "default",
            "figurePosition": {
                "x": 1,
                "y": 1
            },
            "figureStatus": "alive"
        },
        {
            "figureId": 3,
            "figureTeam": "white",
            "figureType": "default",
            "figurePosition": {
                "x": 2,
                "y": 0
            },
            "figureStatus": "alive"
        },
        {
            "figureId": 4,
            "figureTeam": "white",
            "figureType": "queen",
            "figurePosition": {
                "x": 2,
                "y": 2
            },
            "figureStatus": "alive"
        },
        {
            "figureId": 5,
            "figureTeam": "white",
            "figureType": "default",
            "figurePosition": {
                "x": 3,
                "y": 1
            },
            "figureStatus": "alive"
        },
        {
            "figureId": 6,
            "figureTeam": "white",
            "figureType": "default",
            "figurePosition": {
                "x": 4,
                "y": 0
            },
            "figureStatus": "alive"
        },
        {
            "figureId": 7,
            "figureTeam": "white",
            "figureType": "default",
            "figurePosition": {
                "x": 4,
                "y": 2
            },
            "figureStatus": "alive"
        },
        {
            "figureId": 8,
            "figureTeam": "white",
            "figureType": "default",
            "figurePosition": {
                "x": 5,
                "y": 1
            },
            "figureStatus": "alive"
        },
        {
            "figureId": 9,
            "figureTeam": "white",
            "figureType": "default",
            "figurePosition": {
                "x": 6,
                "y": 0
            },
            "figureStatus": "alive"
        },
        {
            "figureId": 10,
            "figureTeam": "white",
            "figureType": "default",
            "figurePosition": {
                "x": 6,
                "y": 2
            },
            "figureStatus": "alive"
        },
        {
            "figureId": 11,
            "figureTeam": "white",
            "figureType": "default",
            "figurePosition": {
                "x": 7,
                "y": 1
            },
            "figureStatus": "alive"
        },
        {
            "figureId": 0,
            "figureTeam": "black",
            "figureType": "default",
            "figurePosition": {
                "x": 7,
                "y": 7
            },
            "figureStatus": "alive"
        },
        {
            "figureId": 1,
            "figureTeam": "black",
            "figureType": "default",
            "figurePosition": {
                "x": 7,
                "y": 5
            },
            "figureStatus": "alive"
        },
        {
            "figureId": 2,
            "figureTeam": "black",
            "figureType": "default",
            "figurePosition": {
                "x": 6,
                "y": 6
            },
            "figureStatus": "alive"
        },
        {
            "figureId": 3,
            "figureTeam": "black",
            "figureType": "default",
            "figurePosition": {
                "x": 5,
                "y": 7
            },
            "figureStatus": "alive"
        },
        {
            "figureId": 4,
            "figureTeam": "black",
            "figureType": "default",
            "figurePosition": {
                "x": 5,
                "y": 5
            },
            "figureStatus": "alive"
        },
        {
            "figureId": 5,
            "figureTeam": "black",
            "figureType": "default",
            "figurePosition": {
                "x": 4,
                "y": 6
            },
            "figureStatus": "alive"
        },
        {
            "figureId": 6,
            "figureTeam": "black",
            "figureType": "default",
            "figurePosition": {
                "x": 3,
                "y": 7
            },
            "figureStatus": "alive"
        },
        {
            "figureId": 7,
            "figureTeam": "black",
            "figureType": "default",
            "figurePosition": {
                "x": 3,
                "y": 5
            },
            "figureStatus": "alive"
        },
        {
            "figureId": 8,
            "figureTeam": "black",
            "figureType": "default",
            "figurePosition": {
                "x": 2,
                "y": 6
            },
            "figureStatus": "alive"
        },
        {
            "figureId": 9,
            "figureTeam": "black",
            "figureType": "default",
            "figurePosition": {
                "x": 1,
                "y": 7
            },
            "figureStatus": "alive"
        },
        {
            "figureId": 10,
            "figureTeam": "black",
            "figureType": "queen",
            "figurePosition": {
                "x": 1,
                "y": 5
            },
            "figureStatus": "alive"
        },
        {
            "figureId": 11,
            "figureTeam": "black",
            "figureType": "default",
            "figurePosition": {
                "x": 0,
                "y": 6
            },
            "figureStatus": "alive"
        }
    ]

    const [table, setTable] = useState<TableType>(renderTable(figures))

    const handleClick = cellClickHandler(table)

    return (
        <div className="table">
            {
                table.map((row, rowIndex) => {
                    return (
                        <div className='table__row'>
                            {
                                row.map((cell, cellIndex) => {
                                    return (
                                        <Cell
                                            waysHandler={handleClick}
                                            setTable={setTable}
                                            showWay={cell.containsWay}
                                            isBlack={(rowIndex % 2 == 0 && cellIndex % 2 == 0) || (rowIndex % 2 != 0 && cellIndex % 2 != 0)}
                                            cellIndex={
                                                rowIndex == 0 && cellIndex == 0 ? 1 :
                                                    rowIndex == 0 && cellIndex == 7 ? 8 :
                                                        rowIndex == 7 && cellIndex == 0 ? 50 :
                                                            rowIndex == 7 && cellIndex == 7 ? 57 : -1
                                            }
                                            figureStatus={cell.figure == null ? 'nofigure' : 'figure'}
                                            figure={cell.figure}
                                            position={cell.cellPosition}
                                        />
                                    )
                                })
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Table