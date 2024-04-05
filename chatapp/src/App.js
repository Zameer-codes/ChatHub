import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import './App.css';
import WaitingRoom from './components/WaitingRoom';
import { JoinHubUrl } from './constants/Urls';
import { useState } from 'react';
import ChatRoom from './components/ChatRoom';
import Home from './pages/Home/Home';

function App() {

  const [connection, setConnection]= useState();
  const [messages, setMessages] = useState([]);

  const joinChatRoom = async (userName, chatRoom) => {
    const conn = new HubConnectionBuilder().withUrl(JoinHubUrl).configureLogging(LogLevel.Information).build();
    conn.on("JoinSpecificChatRoom",(userName, msg)=>{
      setMessages(prev=>[...prev, {userName, message:msg}]);

    });

    conn.on("ReceiveSpecificMessage", (userName, message)=>{
      setMessages((prev)=> [...prev, {userName, message}]);
    })

    await conn.start();
    await conn.invoke("JoinSpecificChatRoom", {userName, chatRoom});
    setConnection(conn);
  }

  const triggerMessage =async(message) =>{
    await connection.invoke("SendMessage", message);
  }

  return (
    <div >
      {/* <h1>Chat Hub</h1>
      {
        !connection ? <WaitingRoom joinChatRoom={joinChatRoom}/>
        :
        <ChatRoom triggerMessage={triggerMessage} messages={messages}/>
      } */}
      
      <Home/>
    </div>
  );
}

export default App;
