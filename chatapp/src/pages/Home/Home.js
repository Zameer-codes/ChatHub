import { Layout, Typography } from 'antd';
import RoomsWindow from '../../components/RoomsWindow/RoomsWindow';
import ChatWindow from '../../components/ChatWindow/ChatWindow'; // Import the ChatWindow component
import './Home.css';
import { useEffect, useState } from 'react';
import { useSignalR } from '../../signalrContext/SignalRContext';
import axios from 'axios';
import { BaseUrl } from '../../constants/Urls';

const Home = () => {
    const [joinedRooms, setJoinedRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [roomMessages, setRoomMessages] = useState({}); // State to store messages for each room
    const signalRConnection = useSignalR();

    useEffect(() => {
        // Fetch joined rooms from API
        const fetchJoinedRooms = async () => {
            try {
                const response = await axios.get(`${BaseUrl}/api/Rooms`);
                setJoinedRooms(response.data);
            } catch (error) {
                console.error('Error fetching joined rooms:', error);
            }
        };

        fetchJoinedRooms();
    }, []);

    useEffect(() => {
        // Subscribe to real-time updates for messages in all joined rooms
        if (signalRConnection) {
            joinedRooms.forEach(room => {
                signalRConnection.on(`ReceiveMessage_${room.roomId}`, (message) => {
                    console.log(`Received message in room ${room.roomId}:`, message);
                    // Update roomMessages state with the new message for the specific room
                    setRoomMessages(prevRoomMessages => ({
                        ...prevRoomMessages,
                        [room.id]: [...(prevRoomMessages[room.id] || []), message]
                    }));
                });
            });
        }

        return () => {
            // Unsubscribe from the 'ReceiveMessage' event for all joined rooms when the component unmounts
            if (signalRConnection) {
                joinedRooms.forEach(room => {
                    signalRConnection.off(`ReceiveMessage_${room.id}`);
                });
            }
        };
    }, [signalRConnection, joinedRooms]);

    const handleRoomSelect = (roomId) => {
        setSelectedRoom(roomId);
    };

    return (
        <Layout className="home-layout">
            <Layout.Header className="home-header">
                <Typography.Title className="home-title">Chat Hub</Typography.Title>
            </Layout.Header>
            <Layout>
                <RoomsWindow joinedRooms={joinedRooms} onSelectRoom={handleRoomSelect} />
                <ChatWindow messages={roomMessages[selectedRoom]} selectedRoom={selectedRoom} hasJoinedRooms={joinedRooms.length > 0}/> {/* Pass messages for the selected room to the ChatWindow */}
            </Layout>
        </Layout>
    );
};

export default Home;
