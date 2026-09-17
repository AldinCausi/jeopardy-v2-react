import { Link } from "react-router-dom";
import './App.css'

function App() {

  return (
    <div className='app'>
      <div>
        <Link to={"/host/create-board"}><button>Erstelle ein Board</button></Link>
        <button>Trete einem Spiel bei</button>
      </div>
    </div>
  )
}

export default App
