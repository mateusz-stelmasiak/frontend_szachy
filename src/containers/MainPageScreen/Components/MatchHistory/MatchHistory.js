import {Component} from "react";
import "./MatchHistory.css"
import "../../../CommonComponents/SectionTitle";
import SectionTitle from "../../../CommonComponents/SectionTitle";
import MatchHistoryItem, {MatchResult, MatchDate, MatchItemInfo, PlayerInfo} from "./MatchHistoryItem"
import "./MatchHistoryItem";
import VariableColor from "../../../CommonComponents/VariableColor";


class MatchHistory extends Component{
    componentDidMount(){
        this.fetchPlayerData();
    }

    fetchPlayerData() {
        const playerId=1;
        const apiUrl = '${API_URL}/match_history?id=${playerId}';
        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                if(data ===undefined){return;}
                //handle empty match history
                //if(data)

                let dataArray= JSON.parse(data);
                this.state.matchHistory = dataArray.map(
                    item => {
                        let result= MatchResult.getResultFromString(item.matchResult);
                        let p1Info=new PlayerInfo(item.p1Username,item.p1PlayedAs,item.p1ELO);
                        let p2Info=new PlayerInfo(item.p2Username,item.p2PlayedAs,item.p2ELO);
                        let date= new MatchDate(item.hour,item.dayMonthYear);
                        let matchItemInfo= new MatchItemInfo(result,item.nOfMoves,p1Info,p2Info,date);
                        return <MatchHistoryItem matchItemInfo={matchItemInfo}/>;
                    }
                )
                console.log('This is your data', data)
            });
    }

    constructor(props) {
        super(props);
        this.state ={
            isLoading: true,
            matchHistory: null
        }
        this.showExampleData();
    }

    showExampleData(){
        //this.isLoading=false;
        let player1Info= new PlayerInfo("Garry_Kassparov","WHITE",1407);
        let player2Info= new PlayerInfo("Rhyzome","BLACK",1308);
        let player3Info= new PlayerInfo("BodyW/Organs","BLACK",1308);
        let matchDate= new MatchDate("15:10","27/05/2021")
        let matchDate2= new MatchDate("14:10","27/05/2021");
        let exampleData= new MatchItemInfo(MatchResult.win,32,player1Info,player2Info,matchDate);
        let exampleData2= new MatchItemInfo(MatchResult.loss,20,player1Info,player2Info,matchDate2);
        let exampleData3= new MatchItemInfo(MatchResult.draw,45,player1Info,player3Info,matchDate2);
        this.state.matchHistory=
            <div className="MatchHistory-container">
                <MatchHistoryItem matchItemInfo={exampleData} />
                <MatchHistoryItem matchItemInfo={exampleData2} />
                <MatchHistoryItem matchItemInfo={exampleData3} />
            </div>
        ;
    }

    render() {
        return (
            <section className="MatchHistory">
                <SectionTitle title="MATCH HISTORY"/>

                <div className="MatchHistory-colors">
                    <VariableColor
                        color={MatchResult.win.color}
                        text={MatchResult.win.name}/>
                    <VariableColor
                        color={MatchResult.loss.color}
                        text={MatchResult.loss.name}/>
                    <VariableColor
                        color={MatchResult.draw.color}
                        text={MatchResult.draw.name}/>
                </div>
                {this.state.isLoading && <MatchHistoryPlaceholder/>}
                {this.state.matchHistory}
            </section>
            );
    }

}

class MatchHistoryPlaceholder extends Component{
    render() {
        return (
            <div className="MatchHistory-placeholder"></div>
        );
    }
}

export default MatchHistory;