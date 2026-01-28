import { Route, Routes } from 'react-router-dom'
import GamePage from './pages/game/GamePage'

function App() {
  return (
    <>
      <Routes>
        <Route path='game' element={<GamePage />} />
      </Routes>
    </>
  )
}

export default App
