import type React from "react";
import type { JSX } from "react";
import cn from 'classnames'
import Table from "../../components/table/Table";
import InfoPanel from "../../components/info-panel/InfoPanel";

type PropsType = {}

const GamePage: React.FC<PropsType> = ({ }): JSX.Element => {
    return (
        <div className="game">
            <div className="container game__container">
                <Table />
                <InfoPanel team="white" />
            </div>
        </div>
    )
}

export default GamePage