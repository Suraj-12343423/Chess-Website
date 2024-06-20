"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const message_1 = require("./message");
class Game {
    constructor(player1, player2) {
        this.moveCount = 0;
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.StartTime = new Date();
        this.player1.send(JSON.stringify({
            type: message_1.INIT_GAME,
            payload: {
                color: "white"
            }
        }));
        this.player2.send(JSON.stringify({
            type: message_1.INIT_GAME,
            payload: {
                color: "black"
            }
        }));
    }
    makeMove(socket, move) {
        try {
            if (socket === this.player1 && this.moveCount % 2 === 0) {
                this.board.move(move);
                this.moveCount++;
            }
            else if (socket === this.player2 && this.moveCount % 2 !== 0) {
                this.board.move(move);
                this.moveCount++;
            }
            else {
                console.log("Invalid move: not player's turn.");
                return;
            }
        }
        catch (e) {
            console.error("Error making move:", e);
            return;
        }
        const gameOver = this.board.isGameOver();
        if (gameOver) {
            const winner = this.board.turn() === "w" ? "black" : "white";
            this.player1.send(JSON.stringify({ type: message_1.GAME_OVER, payload: { winner } }));
            this.player2.send(JSON.stringify({ type: message_1.GAME_OVER, payload: { winner } }));
            // Optionally, close connections and perform cleanup here
            return;
        }
        const movePayload = { type: message_1.MOVE, payload: move };
        if (this.moveCount % 2 === 0) {
            this.player1.send(JSON.stringify(movePayload));
        }
        else {
            this.player2.send(JSON.stringify(movePayload));
        }
    }
}
exports.Game = Game;
