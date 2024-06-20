import { useNavigate } from "react-router-dom";
import { Button } from "../Components/Button";

export const Landing = () => {
  const navigate = useNavigate();
  return (
    <div className="">
      <div className="flex items-center justify-center gap-6 pt-8">
        <div className="flex justify-center">
          <img src={"chessboard.jpg"} className="max-w-96" alt="Chessboard" />
        </div>
        <div>
          <div className="flex justify-center">
            <h1 className="text-4xl font-bold text-white mr-4">
              Welcome to ChessMaster!
            </h1>
          </div>
          <div className="mt-4 flex justify-center">
            <Button
              onClick={() => {
                navigate("/game");
              }}
            >
              Play Online
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
