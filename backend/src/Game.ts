import { Chess, Move } from "chess.js";
import WebSocket from "ws";
import { GAME_OVER, INIT_GAME, MOVE } from "./message";

export class Game {


    

    public player1: WebSocket;
    public player2: WebSocket;
    public board: Chess;
    private StartTime: Date;
    private moveCount = 0;
    getGameState: any;

    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1
        this.player2 = player2
        this.board = new Chess()
        this.StartTime = new Date()

        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "white"
            }
        }))

        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "black"
            }
        }))
    }

    makeMove(socket: WebSocket, move: { from: string; to: string; }) {
        try {
            if (socket === this.player1 && this.moveCount % 2 === 0) {
                this.board.move(move);
                this.moveCount++;
            } else if (socket === this.player2 && this.moveCount % 2 !== 0) {
                this.board.move(move);
                this.moveCount++;
            } else {
                console.log("Invalid move: not player's turn.");
                return;
            }
        } catch (e) {
            console.error("Error making move:", e);
            return;
        }

        const gameOver = this.board.isGameOver();
        if (gameOver) {
            const winner = this.board.turn() === "w" ? "black" : "white";
            this.player1.send(JSON.stringify({ type: GAME_OVER, payload: { winner } }));
            this.player2.send(JSON.stringify({ type: GAME_OVER, payload: { winner } }));
            // Optionally, close connections and perform cleanup here
            return;
        }

        const movePayload = { type: MOVE, payload: move };

        if (this.moveCount % 2 === 0) {
            this.player1.send(JSON.stringify(movePayload));
        } else {
            this.player2.send(JSON.stringify(movePayload));
        }

    }

}
