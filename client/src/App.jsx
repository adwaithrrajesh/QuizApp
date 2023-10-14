import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Index from './Quiz/Index'
import UserDetails from './UserDetails/userDetails'
import AddQuiz from './AddQuiz/AddQuiz'
import TopPlayers from './Quiz/TopPlayers'

function App() {


  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<UserDetails/>}/>
      <Route path='/addQuiz' element={<AddQuiz/>}/>
      <Route path='/takeQuiz' element={<Index/>}/>
      <Route path='/topPlayers' element={<TopPlayers/>}/>
     </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
