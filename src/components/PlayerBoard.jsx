import "./PlayerBoard.css";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig.js";

export default function PlayerBoard() {
  const { roomCode } = useParams();
  const [boardExists, setBoardExists] = useState(null);
  const [board, setBoard] = useState(null);

  useEffect(() => {
    const getBoard = async () => {
      const boardRef = doc(db, "boards", roomCode);
      const boardSnap = await getDoc(boardRef);
      if (boardSnap.exists()) {
        setBoardExists(true);
        setBoard(boardSnap.data());
      } else {
        setBoardExists(false);
        setBoard(null);
      }
    };
    getBoard();
  }, [roomCode]);

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
          {board.board.map((cat) => (
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


    </div>
  );
}
