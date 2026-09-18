import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig.js";
import { collection, query, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";

export default function BoardSelector() {
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "boards"));
    const unsub = onSnapshot(q, (boardSnapshot) => {
      const tempBoards = [];

      boardSnapshot.forEach((board) => {
        tempBoards.push({ id: board.id, ...board.data() });
      });
      setBoards(tempBoards);
    }, (error) => {console.log("Fehler: ", error)});
    return () => unsub();
  }, []);

  return (
    <div>
      <>
        <p>Hoste ein vorheiges Brett</p>
        {boards.map((board) => (
          <Link key={board.id} to={`/host/${board.id}`}>
            <button>{board.id}</button>
          </Link>
        ))}
      </>
    </div>
  );
}
