import React, { useState } from 'react';
import { Layout, List, Input, Button } from 'antd';
import './ChatWindow.css'; // Import your CSS file for styling
import { userId } from '../../App';

const ChatWindow = ({ messages = [], selectedRoom, hasJoinedRooms, onSendMessage }) => {
    const [newMessage, setNewMessage] = useState('');

    const handleMessageSend = () => {
        // Call the sendMessage function passed from the parent component
        if (newMessage.trim() !== '') {
            onSendMessage(newMessage);
            setNewMessage(''); // Clear the input field after sending message
        }
    };

    return (
        <Layout.Content className="chat-window">
            {hasJoinedRooms ? (
                selectedRoom ? (
                    <>
                        {messages.length === 0 ? (
                            <div className="placeholder-message">Start the conversation!</div>
                        ) : (
                            <List
                                className="message-list"
                                dataSource={messages}
                                renderItem={item => (
                                    <List.Item className={`message-item ${item.senderId === userId ? 'right' : 'left'}`}>
                                        {item.content}
                                    </List.Item>
                                )}
                            />
                        )}

                        <div className="input-section">
                            <Input
                                placeholder="Type your message..."
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                                onPressEnter={handleMessageSend}
                            />
                            <Button type="primary" onClick={handleMessageSend}>Send</Button>
                        </div>
                    </>
                ) : (
                    <div className="placeholder-message">Select a room to start chatting!</div>
                )
            ) : (
                <div className="placeholder-message">You haven't joined any rooms yet. Join or create a room to start chatting!</div>
            )}
        </Layout.Content>
    );
};

export default ChatWindow;
