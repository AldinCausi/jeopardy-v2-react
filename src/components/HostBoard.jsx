
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig.js";

export default function HostBoard() {
  const { roomCode } = useParams();
  const navigate = useNavigate();

  const [boardExists, setBoardExists] = useState(null);
  const [board, setBoard] = useState(null);
  const [players, setPlayers] = useState(null);

  const [tileClicked, setTileClicked] = useState(null);
  const [isImage, setIsImage] = useState(false);

  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [endGameModal, setEndGameModal] = useState(false);

  // Hole das Board das gehostet werden soll aus der Datenbank
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
      setPlayers(data.players);
    });
    return unsub;
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
    const boardRef = doc(db, "boards", roomCode);
    updateDoc(boardRef, {
      activeTile: null,
    });
  }

  async function showImage() {
    const updatedBoard = board.map((c) =>
      c.catId === tileClicked.cat.catId
        ? {
            ...c,
            tiles: c.tiles.map((t) =>
              t.tileId === tileClicked.tile.tileId
                ? { ...t, visible: !t.visible }
                : t,
            ),
          }
        : c,
    );

    setBoard(updatedBoard);
    setIsImage(!isImage);

    const boardRef = doc(db, "boards", roomCode);
    await updateDoc(boardRef, {
      board: updatedBoard,
    });
  }

  function resetBoardHelper() {
    const resetBoard = board.map((c) => ({
      ...c,
      tiles: c.tiles.map((t) => ({
        ...t,
        played: false,
        visible: false,
      })),
    }));

    const resetPlayers = players.map((p) => ({
      ...p,
      points: 0
    }));

    setBoard(resetBoard);
    setPlayers(resetPlayers)
    setTileClicked(null);
    setShowQuestionModal(false);
    setIsImage(false);

    return resetBoard;
  }

  async function resetBoard() {
    const emptyBoard = resetBoardHelper();

    const boardRef = doc(db, "boards", roomCode);
    await updateDoc(boardRef, {
      board: emptyBoard,
      activeTile: null,
    });
  }

  async function endGame() {
    const emptyBoard = resetBoardHelper();

    const boardRef = doc(db, "boards", roomCode);
    await updateDoc(boardRef, {
      boardName: "",
      board: emptyBoard,
      players: [],
      activeTile: null,
    });

    navigate("/");
  }

  async function updatePlayerData(playerId, value, correct) {
    if (tileClicked === null) {
      return;
    }
    let pointsToAdd = parseInt(value);
    if (!correct) {
      pointsToAdd = -(pointsToAdd / 2)
    }

    const updatedPlayers = players.map(p =>
      p.id === playerId
        ?
        {
          ...p,
          points: p.points + pointsToAdd
        } : p
    );

    setPlayers(updatedPlayers);

    const boardRef = doc(db, "boards", roomCode);
    await updateDoc(boardRef, {
      players: updatedPlayers
    })

  }

  return (
    <div className="host-main">
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
        <>
          <div className="host-board">
            {board.map((cat) => (
              <div key={cat.catId} className="host-category">
                <div className="host-category-title">
                  <p>{cat.category}</p>
                </div>

                {cat.tiles.map((tile) => (
                  <div
                    key={tile.tileId}
                    className={`host-tile ${tile.played ? "played" : ""}`}
                    onClick={() => !tile.played && handleTileClick(cat, tile)}
                  >
                    <p>{tile.points}</p>
                  </div>
                ))}
              </div>
            ))}
            <button onClick={resetBoard}>Board zurücksetzen</button>
            <button onClick={() => setEndGameModal(true)}>Spiel beenden</button>
            <p>Raum Code: {roomCode}</p>
          </div>

          <div className="host-players-grid">
            {players.map((p) => (
              <div key={p.id} className="host-player-grid-item">
                <p>{p.name}</p>
                <div className="points">
                  <p>Punkte: {p.points}</p>
                  <button onClick={() => updatePlayerData(p.id, tileClicked.tile.points, true)}> + </button>
                  <button onClick={() => updatePlayerData(p.id, tileClicked.tile.points, false)}> - </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {endGameModal && (
        <div className="end-game-modal">
          <p>Spiel beenden</p>
          <div>
            <button onClick={endGame}>Ja</button>
            <button onClick={() => setEndGameModal(false)}>Nein</button>
          </div>
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
            <p>{tileClicked.tile.answer}</p>
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
