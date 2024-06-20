/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-case-declarations */
import { useEffect, useState } from "react";
import { Button } from "../Components/Button";
import { ChessBoard } from "../Components/ChessBoard";
import { useSocket } from "../hooks/useSocket";
import { Chess } from "chess.js";

export const INIT_GAME = "init_game";

export const MOVE = "move";

export const GAME_OVER = "Game_Over";

export const Game = () => {
  const socket = useSocket();

  const [chess, setChess] = useState(new Chess());

  const [board, setBoard] = useState(chess.board());

  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!socket) return;
    socket.onmessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      console.log(message);
      switch (message.type) {
        case INIT_GAME:
          const newGame = new Chess(); // Create a new Chess instance for a new game
          setChess(newGame);
          setBoard(newGame.board());
          console.log("game initialized");
          setStarted(true);
          break;
        case MOVE:
          const move = message.payload;
          const updatedChess = new Chess(chess.fen()); // Create a new Chess instance based on current FEN
          updatedChess.move(move);
          setChess(updatedChess);
          setBoard(updatedChess.board());
          console.log("move made");
          break;
        case GAME_OVER:
          const winner = message.payload.winner;
          if (winner === "draw") {
            alert("Game over. It's a draw.");
          } else {
            alert(`Game over. Winner: ${winner}`);
          }
          setStarted(false);
          break;
      }
    };
  }, [socket, chess]); // Include chess in the dependency array to ensure updates

  if (!socket) return <div>Connecting....</div>;
  return (
    <div className="justify-center flex">
      <div className="pt-8 max-w-screen-lg w-full">
        <div className="grid grid-cols-6 gap-4 w-full">
          <div className="col-span-4 w-full flex justify-center">
            <ChessBoard
              chess={chess}
              setBoard={setBoard}
              socket={socket}
              board={board}
            />
          </div>
          <div className="col-span-2 bg-slate-900 w-full flex justify-center">
            <div className="pt-9">
              {!started && (
                <Button
                  onClick={() => {
                    socket.send(
                      JSON.stringify({
                        type: INIT_GAME,
                      })
                    );
                  }}
                >
                  Play Online
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
