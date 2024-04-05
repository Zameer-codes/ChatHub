import { Layout, Menu, Button, Modal, Form, Input } from 'antd';
import React, { useState } from 'react';
import './RoomsWindow.css';

const RoomsWindow = ({ joinedRooms }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Function to handle modal visibility
    const showModal = () => {
        setIsModalVisible(true);
    };

    // Function to handle modal submission
    const handleOk = () => {
        setIsModalVisible(false);
        // Logic to handle room creation
        // You can add API calls here to create a new room
    };

    // Function to handle modal cancellation
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
                >
                    {/* Display already joined rooms here */}
                    <Menu.Item key="1">Room 1</Menu.Item>
                    <Menu.Item key="2">Room 2</Menu.Item>
                    {/* Add more menu items dynamically */}
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
                {/* Room creation form */}
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