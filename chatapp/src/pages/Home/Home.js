import { Layout, Typography } from 'antd';
import RoomsWindow from '../../components/RoomsWindow/RoomsWindow';
import './Home.css';

const Home = () => {
    return (
        <Layout className="home-layout">
            <Layout.Header className="home-header">
                <Typography.Title className="home-title">Chat Hub</Typography.Title>
            </Layout.Header>
            <Layout>
                <RoomsWindow />
                <Layout.Content className="home-content">
                    {/* Add your chat content here */}
                </Layout.Content>
            </Layout>
        </Layout>
    );
};

export default Home;