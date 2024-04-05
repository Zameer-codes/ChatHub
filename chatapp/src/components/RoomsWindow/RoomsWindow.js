import { Layout, Menu, Button, Modal, Form, Input } from 'antd';
import React, { useState } from 'react';
import './RoomsWindow.css';

const RoomsWindow = ({ joinedRooms, onSelectRoom }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
        // Logic to handle room creation
        // You can add API calls here to create a new room
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <Layout.Sider width={200}>
            <div className="rooms-window-content">
                <Menu
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    className="room-menu"
                    onSelect={({ key }) => onSelectRoom(key)}
                >
                    {joinedRooms.map(room => (
                        <Menu.Item key={room.roomId}>
                            {room.roomName}
                        </Menu.Item>
                    ))}
                </Menu>
                <Button type="primary" onClick={showModal} className="create-room-button">
                    Create New Room
                </Button>
            </div>
            <Modal
                title="Create New Room"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form>
                    <Form.Item
                        label="Room Name"
                        name="roomName"
                        rules={[{ required: true, message: 'Please input the room name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    {/* Add more form fields as needed */}
                </Form>
            </Modal>
        </Layout.Sider>
    );
};

export default RoomsWindow;
