import type { JSX } from "react";
import type React from "react";

type PropsType = {
    team: 'white' | 'black'
}

const InfoPanel: React.FC<PropsType> = ({ team }): JSX.Element => {
    return (
        <div className="info-panel">
            <div className="info-panel__block">
                <span>Вы играете за {team == 'black' ? 'черных' : 'белых'}</span>
            </div>
        </div>
    )
}

export default InfoPanel