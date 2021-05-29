//Matchmaking manager
import WebSocketClient from "./WebSocket";
import {API_URL} from "./APIConfig"


export class MatchmakingManager{
    //TO-DO wpisac route
    queueInfoRoute="/q";

    constructor(playerID) {
        this.playerID=playerID;
        this.wSocket=new WebSocketClient();
        this.playerInQ=false;
    }

    //returns numberOfPlayers currently in queue
    async getQueueInfo(){
        let url= API_URL+this.queueInfoRoute;
        try {
            const response= await fetch(url);
            const json = await response.json();
            let data = JSON.parse(json);
            return data.playersInQueue;
        }
        catch (e) {
            console.log(e);
            return "loading..";
        }
    }

    setPlayerInQ(value){
        this.playerInQ=value;
    }

    //TO DO
    async findMatch()
    {
        //send playerID

        //await for response
        while(this.playerInQ){
            //return response if found

            await this.sleep(200);
        }

        return -1;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

