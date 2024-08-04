import ChatApp from "./Chats/ChatApp"
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import './App.css';
import Home from "./Home";
import MainPage from "./Entrys/MainPage";
function App() {

  return (
 <div>
<BrowserRouter>
<Routes>
  <Route path="/" element={<MainPage/>}/>
  <Route path="Home" element={<Home/>}/>
</Routes>
</BrowserRouter>
 </div>
  )
}

export default App
