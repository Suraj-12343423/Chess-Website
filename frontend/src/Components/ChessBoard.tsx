/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Color, PieceSymbol, Square } from "chess.js";
import { useEffect, useState } from "react";
import { MOVE } from "../PAGES/Game";
import { BlackPawn } from "../assets/svgComponents/BlackPawn.tsx";
import WhitePawn from "../assets/svgComponents/WhitePawn.tsx";
import BlackRook from "../assets/svgComponents/BlackRook.tsx";
import WhiteRook from "../assets/svgComponents/WhiteRook.tsx";
import BlackKnight from "../assets/svgComponents/BlackKnight.tsx";
import WhiteKnight from "../assets/svgComponents/WhiteKnight.tsx";
import BlackBishop from "../assets/svgComponents/BlackBishop.tsx";
import WhiteBishop from "../assets/svgComponents/WhiteBishop.tsx";
import BlackQueen from "../assets/svgComponents/BlackQueen.tsx";
import WhiteQueen from "../assets/svgComponents/WhiteQueen.tsx";
import BlackKing from "../assets/svgComponents/BlackKing.tsx";
import WhiteKing from "../assets/svgComponents/WhiteKing.tsx";
export const ChessBoard = ({
  chess,
  setBoard,
  board,
  socket,
}: {
  chess: any;
  setBoard: any;
  board: ({ square: Square; type: PieceSymbol; color: Color } | null)[][];
  socket: WebSocket;
}) => {
  const [from, setFrom] = useState<null | Square>(null);

  useEffect(() => {
    const handleOpponentMove = (event: { data: string }) => {
      const data = JSON.parse(event.data);
      if (data.type === MOVE) {
        const { move } = data.payload;
        const result = chess.move(move, { sloppy: true });
        if (result === null) {
          console.error("Invalid move", move);
        } else {
          setBoard(chess.board());
        }
      }
    };

    socket.addEventListener("message", handleOpponentMove);
    return () => socket.removeEventListener("message", handleOpponentMove);
  }, [socket, setBoard, chess]);

  const handleSquareClick = (squareRepresentation: Square) => {
    if (!from) {
      setFrom(squareRepresentation);
    } else {
      const fromSquare = from as Square;
      const toSquare = squareRepresentation as Square;
      const moveObject: any = {
        from: fromSquare,
        to: toSquare,
        promotion: "q",
      };

      const moveResult = chess.move(moveObject);
      if (moveResult) {
        setBoard(chess.board());
        socket.send(
          JSON.stringify({
            type: MOVE,
            payload: {
              move: moveObject,
            },
          })
        );
        setFrom(null);
      } else {
        setFrom(null);
      }
    }
  };

  return (
    <div className="text-white-200">
      {board.map((row, i) => {
        return (
          <div className="flex" key={i}>
            {row.map((square, j) => {
              const squareRepresentation = (String.fromCharCode(97 + (j % 8)) +
                "" +
                (8 - i)) as Square;
              return (
                <div
                  onClick={() => handleSquareClick(squareRepresentation)}
                  key={j}
                  className={`w-16 h-16 ${
                    (i + j) % 2 === 0 ? "bg-green-500" : "bg-white"
                  }`}
                >
                  <div className="w-full justify-center flex h-full">
                    <div
                      className="h-full justify-center flex flex-col"
                      style={{
                        width: "100%", // Adjusted from 75% to 100%
                        height: "100%", // Adjusted from 75% to 100%
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {square ? (
                        square.color === "b" ? (
                          square.type === "p" ? (
                            <BlackPawn />
                          ) : square.type === "r" ? (
                            <BlackRook />
                          ) : square.type === "n" ? (
                            <BlackKnight />
                          ) : square.type === "b" ? (
                            <BlackBishop />
                          ) : square.type === "q" ? (
                            <BlackQueen />
                          ) : (
                            <BlackKing />
                          )
                        ) : square.type === "p" ? (
                          <WhitePawn />
                        ) : square.type === "r" ? (
                          <WhiteRook />
                        ) : square.type === "n" ? (
                          <WhiteKnight />
                        ) : square.type === "b" ? (
                          <WhiteBishop />
                        ) : square.type === "q" ? (
                          <WhiteQueen />
                        ) : (
                          <WhiteKing />
                        )
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
