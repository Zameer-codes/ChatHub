import { useState } from "react";

const SendMessage = ({triggerMessage}) => {
    const [message, setMessage] = useState("");
    return (
        <div>
            <form onSubmit={(event) => {
                event.preventDefault();
                triggerMessage(message);
                setMessage("");
            }}>
                <input type="text" placeholder="type message" onChange={e => setMessage(e.target.value)} />
                <button type="submit">Send</button>
            </form>
        </div>
    )
}

export default SendMessage;