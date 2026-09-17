import { useState } from "react";
import "./CreateBoardPage.css";
import { useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig.js";
import TileForm from "./TileForm.jsx";
/*
Fabriken für Board und Form Strukturen.
*/
function createTile(id) {
  return {
    tileId: id,
    type: "text",
    points: "",
    question: "",
    answer: "",
    imageUrl: "",
  };
}

function createCategories(id) {
  return {
    catId: id,
    category: "",
    locked: false,
    tiles: Array.from({ length: 5 }).map((_, j) => createTile(j)),
  };
}

function createEmptyFormData() {
  return {
    points: "",
    question: "",
    answer: "",
    type: "text",
    imageUrl: "",
  };
}

// Erstellt einen Code für den Raum, der für die URL benutzt werden wird.
function generateRoomCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export default function CreateBoardPage() {
  /*
  Initialer Zustand eines Boards, Standardtyp für Tiles ist 'text'
  */
  const [board, setBoard] = useState(() =>
    Array.from({ length: 5 }).map((_, i) => createCategories(i)),
  );
  const [editingTile, setEditingTile] = useState(null);

  // State für Daten, die aus der Form für die Daten der Tiles geholt werden
  const [formData, setFormData] = useState(createEmptyFormData());

  useEffect(() => {
    console.log("Board State: ", board);
    console.log("FormData", formData);
    console.log(editingTile);
  });

  /*
  Funktionen, welche die Eingabe der Kategorien handhaben.
  */
  function handleSaveCategoryName(id, value) {
    setBoard(
      board.map((cat) =>
        cat.catId === id ? { ...cat, category: value } : cat,
      ),
    );
  }

  function lockCategoryInput(id) {
    setBoard(
      board.map((cat) =>
        cat.catId === id ? { ...cat, locked: !cat.locked } : cat,
      ),
    );
  }

  /*
  Funktionen, welche die Eingabe der Daten für die Tiles handhaben
  */

  function resetForm() {
    setFormData(createEmptyFormData());
  }

  function handleTileClick(catId, tileId) {
    setEditingTile({ catId, tileId });

    const cat = board.find(c => c.catId === catId);
    const tile = cat.tiles.find(t => t.tileId === tileId);
    setFormData({ ...formData, ...tile });
  }

  function onFormChange(field, value) {
    setFormData({ ...formData, [field]: value });
  }

  function handleCancelForm() {
    setEditingTile(null);
    resetForm();
  }

  function handleChangeTileData() {
    setBoard(
      board.map((cat) =>
        cat.catId === editingTile.catId
          ? {
              ...cat,
              tiles: cat.tiles.map((tile) =>
                tile.tileId === editingTile.tileId
                  ? { ...tile, ...formData }
                  : tile,
              ),
            }
          : cat,
      ),
    );
    resetForm();
    setEditingTile(null);
  }

  /*
  Speichert das Board in Firestore
  */
  function saveBoardToDb() {
    // Einzigartiger Code für den Raum
    const roomCode = generateRoomCode();

    const boardRef = doc(db, "boards", roomCode);
    setDoc(boardRef, {
      activeTile: null,
      board: board,
    });
  }

  return (
    <div className="main">
      <div className="board-wrapper">
        <div className="board">
          {board.map((cat) => (
            <div key={cat.catId} className="category">
              <div className="category-input">
                <input
                  placeholder="Kategorie"
                  disabled={cat.locked}
                  value={cat.category}
                  onChange={(e) =>
                    handleSaveCategoryName(cat.catId, e.target.value)
                  }
                />
                <button onClick={() => lockCategoryInput(cat.catId)}>
                  {cat.locked ? "Ändern" : "Speichern"}
                </button>
              </div>

              {cat.tiles.map((tile) => (
                <div
                  key={tile.tileId}
                  className="tile"
                  onClick={() => handleTileClick(cat.catId, tile.tileId)}>
                  <p>{tile.points}</p>
                  <p>{tile.question}</p>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="save-btn-container">
          <button className="save-board-btn" onClick={() => saveBoardToDb()}>
            Brett Speichern
          </button>
        </div>
      </div>

      <div className="form-wrapper">
        {editingTile && (
          <TileForm
            formData={formData}
            onFormChange={onFormChange}
            onSaveForm={handleChangeTileData}
            onFormReset={resetForm}
            onCancel={handleCancelForm}
          />
        )}
      </div>
    </div>
  );
}
