import ChatApp from "./Chats/ChatApp"
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import './App.css';
import Home from "./Home";
import MainPage from "./Entrys/MainPage";
import MessageItem from "./Chats/MessageItem";
import Users from "./Pages/Users";
import Chat from "./Chats/ChatApp";
import UserAndMessage from "./Pages/UserAndMessage";
import Navbar from "./Pages/Navbar";
import Navbars from "./Pages/Navbar";
import WelcomeNav from "./Pages/WelcomeNav";
function App() {

  return (
 <div>
<BrowserRouter>
<Routes>
  <Route path="/" element={<Home/>}/>
  <Route path="/ChatApp/:recipientId" element={<Chat />} />
  <Route path="/Users" element={<Users/>}/>
  <Route path="/UserAndMessage" element={<UserAndMessage/>}/>
  <Route path="/Navbar" element={<Navbars/>}/>
  <Route path="/WelcomeNav" element={<WelcomeNav/>}/>
</Routes>
</BrowserRouter>
 </div>
  )
}

export default App
