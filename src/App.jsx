import { Link } from "react-router-dom";
import { useState } from "react";
import BoardSelector from "./components/BoardSelector";
import { db } from "./firebase/firebaseConfig.js";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";


function createPlayer(id) {
  return {
    id: id,
    name: "",
    points: ""
  }
}


function App() {
  const [showForm, setShowForm] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [gameExists, setGameExists] = useState(null);
  const [nameErr, setNameErr] = useState(false);
  const [roomErr, setRoomErr] = useState(false);
  const [maxPlayersReached, setMaxPlayersReached] = useState(false);

  const [playerName, setPlayerName] = useState("");
  const [players, setPlayers] = useState(() =>
    Array.from({ length: 4 }).map((_, i) => createPlayer(i))
  );

  const navigate = useNavigate();

  async function findGame() {
    const boardRef = doc(db, "boards", roomCode);
    const boardSnap = await getDoc(boardRef);
    const exists = boardSnap.exists();
    setGameExists(exists);
    return exists;
  }

  async function addPlayer() {

    const boardRef = doc(db, "boards", roomCode);
    const boardSnap = await getDoc(boardRef);
    const currentPlayers = boardSnap.data().players;

    if (currentPlayers.length === 4) {
      setMaxPlayersReached(true);
      return false;
    }

    const newPlayer = {
      id: currentPlayers.length,
      name: playerName,
      points: 0
    }

    const updatedPlayers = [...currentPlayers, newPlayer]

    setPlayers(updatedPlayers);

    await updateDoc(boardRef, {
      players: updatedPlayers
    });

    return true;
  }

  async function joinGame() {
    setNameErr(false);
    setRoomErr(false);

    if (playerName === "") {
      setNameErr(true);
      return;
    }

    if (roomCode === "") {
      setRoomErr(true);
      return;
    }

    const exists = await findGame();
    if (!exists) {
      setRoomErr(true);
      return;
    }

    const added = await addPlayer();
    if (!added) return;
    navigate(`/game/${roomCode}`);
  }

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
          <input
            placeholder="Suche einen Namen aus"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
          <input
            placeholder="Raum Code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
          />

          <button onClick={joinGame}>Raum beitreten</button>
          {nameErr && (
            <p className="error-msg">Gebe einen Namen ein.</p>
          )}
          {roomErr && (
            <p className="error-msg">Ungültiger Raum Code.</p>
          )}
          {maxPlayersReached && (
            <p className="error-msg">Kein Platz für weitere Spieler.</p>
          )}

        </div>
      )}
    </div>
  );
}

export default App;
