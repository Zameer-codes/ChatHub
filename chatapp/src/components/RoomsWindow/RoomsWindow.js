import { Layout, Menu, Button, Modal, Form, Input } from 'antd';
import React, { useState } from 'react';
import './RoomsWindow.css';
import SearchAndJoinRoom from './JoinRoom/JoinRoom';

const RoomsWindow = ({ joinedRooms, onSelectRoom, onCreateRoom, fetchJoinedRooms, setRoomMessages, signalRConnection}) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [joinModalVisible, setJoinModalVisible] = useState(false);
    const [form] = Form.useForm();

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        form.validateFields().then((values) => {
            onCreateRoom(values.roomName);
            setIsModalVisible(false);
            form.resetFields();
        });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
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
                        <Menu.Item key={room.id}>
                            {room.name}
                        </Menu.Item>
                    ))}
                </Menu>
                <Button type="primary" onClick={showModal} className="create-room-button">
                    Create New Room
                </Button>
                <Button type="primary" onClick={()=>setJoinModalVisible(true)} className="create-room-button">
                    Join New Room
                </Button>
            </div>
            <Modal
                title="Create New Room"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form}>
                    <Form.Item
                        label="Room Name"
                        name="roomName"
                        rules={[{ required: true, message: 'Please input the room name!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
            <SearchAndJoinRoom joinModalVisible={joinModalVisible} setJoinModalVisible={setJoinModalVisible} fetchJoinedRooms={fetchJoinedRooms} setRoomMessages={setRoomMessages} signalRConnection={signalRConnection}/>
        </Layout.Sider>
    );
};

export default RoomsWindow;
