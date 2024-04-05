import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import './App.css';
import WaitingRoom from './components/WaitingRoom';
import { JoinHubUrl } from './constants/Urls';
import { useState } from 'react';
import ChatRoom from './components/ChatRoom';
import Home from './pages/Home/Home';
import { SignalRProvider } from './signalrContext/SignalRContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {

  const [connection, setConnection] = useState();
  const [messages, setMessages] = useState([]);

  const joinChatRoom = async (userName, chatRoom) => {
    const conn = new HubConnectionBuilder().withUrl(JoinHubUrl).configureLogging(LogLevel.Information).build();
    conn.on("JoinSpecificChatRoom", (userName, msg) => {
      setMessages(prev => [...prev, { userName, message: msg }]);

    });

    conn.on("ReceiveSpecificMessage", (userName, message) => {
      setMessages((prev) => [...prev, { userName, message }]);
    })

    await conn.start();
    await conn.invoke("JoinSpecificChatRoom", { userName, chatRoom });
    setConnection(conn);
  }

  const triggerMessage = async (message) => {
    await connection.invoke("SendMessage", message);
  }

  return (
    <SignalRProvider>
      <Router>
        <Routes>
          {/* <Route path="/login" component={Login} /> */}
          {/* <Route path="/logout" component={Logout} /> */}
          <Route path="/" element={<Home/>} />
        </Routes>
      </Router>
    </SignalRProvider>
    // <div >
    // //   <h1>Chat Hub</h1>
    //   {
    //     !connection ? <WaitingRoom joinChatRoom={joinChatRoom}/>
    //     :
    //     <ChatRoom triggerMessage={triggerMessage} messages={messages}/>
    //   }

    //    <Home/>
    //  </div>
  );
}

export default App;
