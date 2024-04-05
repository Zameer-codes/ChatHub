import SendMessage from "./SendMessage";


const ChatRoom = ({ triggerMessage, messages }) => {
    return (
        <div>
            {
                messages && messages.map(eachChat => (
                    <p>{eachChat.message} - {eachChat.userName}</p>
                ))
            }
            <SendMessage triggerMessage={triggerMessage} />
        </div>
    )
}

export default ChatRoom;