import {Component} from "react";
import GameContainer from "./Components/GameContainer"
import Chat from "./Components/Chat"
import "./PlayGameScreen.css"


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
                <GameContainer/>
            </div>
        );
    }
}

export default PlayGameScreen;
