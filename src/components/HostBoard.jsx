import "./style/Board.css";
import "./HostBoard.css";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig.js";

export default function HostBoard() {
  const { roomCode } = useParams();
  const [boardExists, setBoardExists] = useState(null);
  const [board, setBoard] = useState(null);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [tileClicked, setTileClicked] = useState(null);
  const [isImage, setIsImage] = useState(false);

  useEffect(() => {
    const getBoard = async () => {
      const boardRef = doc(db, "boards", roomCode);
      const boardSnap = await getDoc(boardRef);
      if (boardSnap.exists()) {
        setBoardExists(true);
        setBoard(boardSnap.data().board);
      } else {
        setBoardExists(false);
        setBoard(null);
      }
    };
    getBoard();
  }, [roomCode]);

  async function handleTileClick(cat, tile) {
    setTileClicked({ cat, tile });

    const updatedBoard = board.map((c) =>
      c.catId === cat.catId
        ? {
            ...c,
            tiles: c.tiles.map((t) =>
              t.tileId === tile.tileId ? { ...t, played: true } : t,
            ),
          }
        : c,
    );

    setBoard(updatedBoard);

    const boardRef = doc(db, "boards", roomCode);
    await updateDoc(boardRef, {
      board: updatedBoard,
      activeTile: { catId: cat.catId, tileId: tile.tileId },
    });
    setShowQuestionModal(true);
  }

  function closeQuestion() {
    setShowQuestionModal(false);
    setTileClicked(null);
    const boardRef = doc(db, "boards", roomCode);
    updateDoc(boardRef, {
      activeTile: null
    });
  }

  async function showImage() {
    const updatedBoard = board.map(c =>
      c.catId === tileClicked.cat.catId
        ? {
          ...c,
          tiles: c.tiles.map(t =>
            t.tileId === tileClicked.tile.tileId ? { ...t, visible: !t.visible } : t
          )
        }
        : c
    );

    setBoard(updatedBoard);
    setIsImage(!isImage);

    const boardRef = doc(db, "boards", roomCode);
    await updateDoc(boardRef, {
      board: updatedBoard
    });
  }

  async function resetBoard() {
    const resetBoard = board.map((c) => ({
      ...c,
      tiles: c.tiles.map((t) => ({
        ...t,
        played: false,
        visible: false
      })),
    }));
    setBoard(resetBoard);
    setTileClicked(null);
    setShowQuestionModal(false);
    setIsImage(false);

    const boardRef = doc(db, "boards", roomCode);

    await updateDoc(boardRef, {
      board: resetBoard,
      activeTile: null,
    });

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
                <div
                  key={tile.tileId}
                  className={`player-tile ${tile.played ? "played" : ""}`}
                  onClick={() => !tile.played && handleTileClick(cat, tile)}
                >
                  <p>{tile.points}</p>
                </div>
              ))}
            </div>
          ))}

          <button onClick={resetBoard}>
            Board zurücksetzen
          </button>
        </div>
      )}
      {showQuestionModal && (
        <div className="question-modal">
          <div>
            <p>{tileClicked.cat.category}</p>
            <p>{tileClicked.tile.points}</p>
          </div>
          <div>
            <p>{tileClicked.tile.question}</p>
            {tileClicked.tile.imageUrl !== "" && (
              <>
                <button onClick={() => showImage()}>Bild On/Off</button>
                {isImage && <img src={`${tileClicked.tile.imageUrl}`}></img>}
              </>
            )}
          </div>
          <button onClick={closeQuestion}>Zurück</button>
        </div>
      )}
    </div>
  );
}
