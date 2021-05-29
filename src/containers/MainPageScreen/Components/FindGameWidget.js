import React, {useEffect, useState} from "react";
import "./FindGameWidget.css"
import TextWithWavyOrnament from "../../CommonComponents/TextWithWavyOrnament";
import {formatTime} from "../../../serverLogic/Utils"
import useTimer from "../../CommonComponents/Timer";
import Dots from "../../CommonComponents/Dots"
import WebSocketClient from "../../../serverLogic/WebSocket";
import async from "async";
import {MatchmakingManager} from "../../../serverLogic/MatchmakingManager";
import {useHistory} from "react-router-dom";


export default function FindGameWidget() {
    const playerId= JSON.parse(localStorage.getItem('user')).playerId;
    const matchMakingManager =new MatchmakingManager();
    const [playersInQ,setPlayersInQ] = useState("loading...");
    const buttonTexts = ["FIND A GAME!", "IN QUEUE"];

    const [isInQ, setIsInQ] = useState(false);
    const [gameId,setGameId]=useState(-1);
    const [buttonText, setButtonText] = useState(buttonTexts[0]);
    const [scope, setScope] = useState(50);
    const {timer, timerRestart} = useTimer(0);

    //routing after having succesfully found a game
    const history = useHistory();
    const routeToNext = () => history.push('/play?id='+{gameId});

    const idleStyle = {
        background: 'linear-gradient(90deg, rgba(200,199,199,1) 30%, rgba(254,254,254,1) 100%)',
        color: '#1c534b'
    }

    const inQStyle = {
        background: 'rgba(218,139,67,1)',
        color: '#e8ece8'
    }
    const QInfoStyle={
        color: '#69aca1'
    };

    function findGame() {
        setIsInQ(!isInQ);
        setButtonText(buttonTexts[isInQ ? 0:1]);
        //restart the timer
        timerRestart();
        isInQ ? joinQ():leaveQ();
    }

    async function joinQ(){
        let playersInQtemp=matchMakingManager.getQueueInfo();
        if(typeof playersInQtemp ==='number') setPlayersInQ(playersInQtemp);

        const gameId= await matchMakingManager.findMatch();
        setGameId(gameId);
    }

    function leaveQ(){
        matchMakingManager.setPlayerInQ(false);
    }

    //called when props are updated
    useEffect(() => {

    });



    return (
        <section id="PLAY" className="PlayGameWidget">
            <button
                style={isInQ ? inQStyle : idleStyle}
                onClick={findGame}
            >
                <TextWithWavyOrnament fontSize='2.5rem'>
                    {buttonText}
                    {isInQ && <Dots/>}
                </TextWithWavyOrnament>

            </button>

            {isInQ &&
            <ul className="QInfo">
                <li><span style={QInfoStyle}>Wait time:</span> {formatTime(timer)}</li>
                <li><span style={QInfoStyle}>Players in queue:</span> {playersInQ}</li>
                <li><span style={QInfoStyle}>Scope:</span> +-{scope}</li>
            </ul>}


        </section>

    );
}
