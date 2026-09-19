
import "./PlayerBoard.css";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig.js";

export default function PlayerBoard() {
  const { roomCode } = useParams();
  const [boardExists, setBoardExists] = useState(null);
  const [board, setBoard] = useState(null);
  const [activeTile, setActiveTile] = useState(null);

  useEffect(() => {
    const boardRef = doc(db, "boards", roomCode);
    const unsub = onSnapshot(boardRef, (snapshot) => {
      if (!snapshot.exists()) {
        setBoardExists(false);
        return;
      }
      const data = snapshot.data();
      setBoardExists(true);
      setBoard(data.board);
      setActiveTile(data.activeTile ?? null);
    });
    return unsub;
  }, [roomCode]);

  function getActiveCategory() {
    return board.find(c => c.catId === activeTile.catId);
  }

  function getActiveTileData() {
    return getActiveCategory().tiles.find(t => t.tileId === activeTile.tileId);
  }

  return (
    <div className="player-main">
      {boardExists === null && <p>Lade Spiel...</p>}

      {boardExists === false && (
        <div>
          <p>Dieser Raum existiert nicht</p>
          <Link to={"/"}>
            <button>Zurück zum Start</button>
          </Link>
        </div>
      )}

      {boardExists === true && (
        <div className="player-board">
          {board.map((cat) => (
            <div key={cat.catId} className="player-category">
              <div className="player-category-title">
                <p>{cat.category}</p>
              </div>

              {cat.tiles.map((tile) => (
                <div key={tile.tileId} className="player-tile">
                  <p>{tile.points}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {activeTile && (
        <div className="question-modal">
          <div>
            <p>{getActiveCategory().category}</p>
            <p>{getActiveTileData().points}</p>
          </div>
          <div>
            {getActiveTileData().imageUrl !== "" && getActiveTileData().visible === true && (
              <img src={`${getActiveTileData().imageUrl}`}></img>
            )}
            <p>{getActiveTileData().question}</p>
          </div>
        </div>
      )}

    </div>
  );
}
