import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Select, Spin } from 'antd';
import { BaseUrl, JoinHubUrl } from '../../../constants/Urls';
import { userId } from '../../../App';

const { Option } = Select;

const SearchAndJoinRoom = ({ joinModalVisible, setJoinModalVisible, fetchJoinedRooms, setRoomMessages, signalRConnection}) => {
    const [loading, setLoading] = useState(false);
    const [allRooms, setAllRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);

    const fetchAllRooms = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BaseUrl}/api/Rooms`);
            setAllRooms(response.data);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAllRooms();
    }, [signalRConnection]);

    const handleJoinRoom = async () => {
        if (selectedRoom) {
            try {
                console.log(signalRConnection)
                if(signalRConnection){
                    signalRConnection.on("JoinSpecificChatRoom", (message) => {
                        console.log("Joined chat room:", message);
                        console.log(selectedRoom);
                        setRoomMessages(prevRoomMessages => {
                            const updatedRoomMessages = { ...prevRoomMessages };
                        
                            // Check if the selected room already exists in the roomMessages state
                            if (updatedRoomMessages.hasOwnProperty(selectedRoom)) {
                                // Append the new join message to the existing room messages array
                                updatedRoomMessages[selectedRoom] = [
                                    ...updatedRoomMessages[selectedRoom],
                                    { message: `${userId} has joined ${selectedRoom}`, user: userId }
                                ];
                            } else {
                                // Create a new entry for the selected room and add the join message
                                updatedRoomMessages[selectedRoom] = [{ message: `${userId} has joined ${selectedRoom}`, user: userId }];
                            }
                        
                            return updatedRoomMessages;
                        });

                        fetchJoinedRooms();
                        setJoinModalVisible(false);
                        setSelectedRoom(null);
                        signalRConnection.off("JoinSpecificChatRoom", message);
                    });
                    await signalRConnection.invoke("JoinSpecificChatRoom", { roomId: selectedRoom,  userId:userId })
                }

            } catch (error) {
                console.error('Error joining room:', error);
            }
        }
    };

    const handleCancel = () => {
        setJoinModalVisible(false);
        setSelectedRoom(null);
    }
    return (
        <div>
            <Modal
                title="Join Room"
                open={joinModalVisible}
                onCancel={() => setJoinModalVisible(false)}
                closeIcon={false}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleJoinRoom}>
                        Join Room
                    </Button>,
                ]}
            >
                <Select
                    style={{ width: '100%' }}
                    placeholder="Select a room"
                    onChange={(value) => setSelectedRoom(value)}
                    value={selectedRoom}
                >
                    {loading ? (
                        <Option value="loading"><Spin /></Option>
                    ) : (
                        <>
                            {allRooms.map(room => (
                                <Option key={room.id} value={room.id}>{room.name}</Option>
                            ))}
                        </>
                    )}
                </Select>
            </Modal>
        </div>
    );
};

export default SearchAndJoinRoom;
