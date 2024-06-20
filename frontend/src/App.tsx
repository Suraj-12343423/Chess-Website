/* eslint-disable @typescript-eslint/no-unused-vars */

import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Game } from "./PAGES/Game";
import { Landing } from "./PAGES/Landing";

function App() {
  // const [count, setCount] = useState(0)

  return (
    <div className="h-screen bg-slate-700">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </BrowserRouter>
      {/* <button className="bg-red-200">JOIN GAMEROOM</button> */}
    </div>
  );
}

export default App;
