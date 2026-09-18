import { Link } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import BoardSelector from "./components/BoardSelector";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [roomCode, setRoomCode] = useState(null);

  return (
    <div className="app">
      <div>
        <Link to={"/host/create-board"}>
          <button>Erstelle ein Board</button>
        </Link>
        <button onClick={() => setShowForm(true)}>Trete einem Spiel bei</button>
      </div>

      <div className="boards-selector">
        <BoardSelector />
      </div>

      {showForm && (
        <div className="form-app">
          <input placeholder="Suche einen Namen aus" />
          <input
            placeholder="Raum Code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
          />
          <Link to={`/game/${roomCode}`}>
            <button>Raum beitreten</button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default App;
