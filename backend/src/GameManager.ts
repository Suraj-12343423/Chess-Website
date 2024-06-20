import WebSocket from "ws"
import { INIT_GAME, MOVE } from "./message";
import { Game } from "./Game";

export class GameManager{

    private games: Game[]
    private PendingUser: WebSocket | null;
    private users: WebSocket[]

    constructor() {
        this.games = []
        this.PendingUser = null;
        this.users=[]
    }

    addUser(socket: WebSocket) {

        this.users.push(socket)
        this.addHandler(socket)

        
    }

    removeUser(socket: WebSocket) {
        this.users = this.users.filter(user => user !== socket)
        

        //stop the game here
    }

    private addHandler(socket: WebSocket) {

        socket.on("message", (data) => {
            console.log("Received message:", data.toString());  // Log received message
            const message = JSON.parse(data.toString())

            if (message.type === INIT_GAME) {
                if (this.PendingUser) {

                    const game = new Game(this.PendingUser, socket, );
                    this.games.push(game);
                    this.PendingUser=null
                } else {
                    this.PendingUser=socket
                }
            }

            if (message.type === MOVE) {
                const game = this.games.find(game=> game.player1 === socket || game.player2 === socket)
                if (game) { 
                    game.makeMove(socket,message.payload.move)
                }
            }
                
        })
        
    }



    





}
