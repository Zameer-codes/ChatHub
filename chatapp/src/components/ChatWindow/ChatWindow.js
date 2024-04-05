import React from 'react';
import { Layout, List } from 'antd';
import './ChatWindow.css'; // Import your CSS file for styling

const ChatWindow = ({ messages=[], selectedRoom, hasJoinedRooms }) => {
    return (
        <Layout.Content className="chat-window">
            {hasJoinedRooms ? (
                selectedRoom ? (
                    messages.length === 0 ? (
                        <div className="placeholder-message">Start the conversation!</div>
                    ) : (
                        <List
                            className="message-list"
                            dataSource={messages}
                            renderItem={item => (
                                <List.Item className={`message-item ${item.isCurrentUser ? 'right' : 'left'}`}>
                                    {item.text}
                                </List.Item>
                            )}
                        />
                    )
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
