import {Component} from "react";
import GameContainer from "./Components/GameContainer"
import Chat from "./Components/Chat"
import "./PlayGameScreen.css"
import P5Wrapper from "react-p5-wrapper"
import sketch from "./Game/Main";

class PlayGameScreen extends Component{

    constructor(props) {
        super(props);
    }

    // single websocket instance for the own application and constantly trying to reconnect.
    componentDidMount() {

    }


    render() {
        return (
            <div className="PlayGameScreen">
                <Chat/>
                <GameContainer>
                    <P5Wrapper sketch={sketch}/>
                </GameContainer>

            </div>
        );
    }
}

export default PlayGameScreen;
