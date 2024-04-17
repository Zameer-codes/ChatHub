import { Layout, Typography, message } from 'antd';
import RoomsWindow from '../../components/RoomsWindow/RoomsWindow';
import ChatWindow from '../../components/ChatWindow/ChatWindow'; // Import the ChatWindow component
import './Home.css';
import { useEffect, useState } from 'react';
import useSignalR from '../../signalrContext/SignalRContext';
import axios from 'axios';
import { BaseUrl, JoinHubUrl } from '../../constants/Urls';
import { userId } from '../../App';
import { fetchAllMessagesApi, fetchJoinedRoomsApi } from '../../api/api';

const Home = () => {
    const [joinedRooms, setJoinedRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [roomMessages, setRoomMessages] = useState({}); // State to store messages for each room
    const signalRConnection = useSignalR(JoinHubUrl);

    const fetchJoinedRooms = async () => {
        setJoinedRooms(await fetchJoinedRoomsApi());
    }

    const fetchAllMessages = async () => {
        let messages = await fetchAllMessagesApi();

        // Group messages by roomId
        const groupedMessages = messages.reduce((acc, message) => {
            const roomId = message.roomId;
            if (!acc[roomId]) {
                acc[roomId] = [];
            }
            acc[roomId].push(message);
            return acc;
        }, {});
        setRoomMessages(groupedMessages);
    }

    useEffect(() => {
        fetchJoinedRooms();
        fetchAllMessages();
    }, []);

    // useEffect(() => {
    //     // Subscribe to real-time updates for messages in all joined rooms
    //     if (signalRConnection) {
    //         // console.log("worked");
    //         joinedRooms.forEach(room => {
    //             signalRConnection.on(`ReceiveMessage_${room.roomId}`, (message) => {
    //                 console.log(`Received message in room ${room.roomId}:`, message);
    //                 // Update roomMessages state with the new message for the specific room
    //                 setRoomMessages(prevRoomMessages => ({
    //                     ...prevRoomMessages,
    //                     [room.id]: [...(prevRoomMessages[room.id] || []), {message:message, user:userId}]
    //                 }));
    //             });
    //         });
    //     }
    //     // console.log(signalRConnection);

    //     return () => {
    //         // Unsubscribe from the 'ReceiveMessage' event for all joined rooms when the component unmounts
    //         if (signalRConnection) {
    //             joinedRooms.forEach(room => {
    //                 signalRConnection.off(`ReceiveMessage_${room.id}`);
    //             });
    //         }
    //     };
    // }, [signalRConnection, joinedRooms]);

    const handleRoomSelect = async (roomId) => {
        setSelectedRoom(roomId);
        try {
            await signalRConnection.invoke("OnViewRoom", roomId);
        } catch (error) {
            console.error('Error joining room:', error);
        }
    };

    const onCreateRoom = async (roomName) => {
        try {
            const response = await axios.post(`${BaseUrl}/api/Rooms/createRoom`, { roomName, userId });
            const newRoom = response.data;
            setJoinedRooms(prevJoinedRooms => [...prevJoinedRooms, newRoom]);
            // You may want to set the selected room here if needed
        } catch (error) {
            console.error('Error creating room:', error);
        }
    };

    const onSendMessage = (message) => {
        if (signalRConnection) {
            signalRConnection.on("ReceiveMessage", (receivedMessageObject) => {
                console.log(receivedMessageObject);
                // Determine the room ID of the new message
                const roomId = receivedMessageObject.roomId;

                // Clone the current state of groupedMessages
                const updatedGroupedMessages = { ...roomMessages };

                // Find the array of messages for the corresponding room
                const specificRoomMessages = updatedGroupedMessages[roomId];

                // If the specificRoomMessages array exists, push the new message to it
                if (specificRoomMessages) {
                    specificRoomMessages.push(receivedMessageObject);
                } else {
                    // If the specificRoomMessages array doesn't exist, create it and add the new message
                    updatedGroupedMessages[roomId] = [receivedMessageObject];
                }
                setRoomMessages(updatedGroupedMessages);
            });
            signalRConnection.invoke("SendMessage", selectedRoom, userId, message);
        }
    }

    console.log(roomMessages);
    return (
        <Layout className="home-layout">
            <Layout.Header className="home-header">
                <Typography.Title className="home-title">Chat Hub</Typography.Title>
                <Typography.Text style={{ color: "white", marginLeft: "auto" }}>{userId}</Typography.Text>
            </Layout.Header>
            <Layout>
                <RoomsWindow joinedRooms={joinedRooms} onSelectRoom={handleRoomSelect} onCreateRoom={onCreateRoom} fetchJoinedRooms={fetchJoinedRooms} setRoomMessages={setRoomMessages} signalRConnection={signalRConnection} />
                <ChatWindow messages={roomMessages[selectedRoom]} selectedRoom={selectedRoom} hasJoinedRooms={joinedRooms.length > 0} onSendMessage={onSendMessage} /> {/* Pass messages for the selected room to the ChatWindow */}
            </Layout>
        </Layout>
    );
};

export default Home;
