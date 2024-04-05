import { useState } from "react";

const WaitingRoom = ({joinChatRoom})=>{
    const [userName, setUserName] = useState("");
    const [chatRoom, setChatRoom] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        joinChatRoom(userName, chatRoom);
        setUserName("");
        setChatRoom("");
    }
    return(
        <form onSubmit={handleSubmit}>
            <input type="text" onChange={e=>setUserName(e.target.value)} placeholder="User Name" value={userName}/>
            <input type="text" onChange={e=>setChatRoom(e.target.value)} placeholder="Chat Room" value={chatRoom}/>
            <button type="submit">Join</button>
        </form>
    )
}

export default WaitingRoom;