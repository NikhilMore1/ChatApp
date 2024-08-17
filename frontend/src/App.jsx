import ChatApp from "./Chats/ChatApp"
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import './App.css';
import Home from "./Home";
import MainPage from "./Entrys/MainPage";
import MessageItem from "./Chats/MessageItem";
function App() {

  return (
 <div>
<BrowserRouter>
<Routes>
  <Route path="/" element={<Home/>}/>
  <Route path="/ChatApp" element={<ChatApp/>}/>
</Routes>
</BrowserRouter>
 </div>
  )
}

export default App
