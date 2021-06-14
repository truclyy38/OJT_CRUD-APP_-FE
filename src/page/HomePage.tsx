import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Image, List, Divider, Layout, Menu } from 'antd';
import { UserOutlined, RightOutlined} from '@ant-design/icons';
import logo from '../assets/image/trucly.jpg'


const { Sider } = Layout;

const data = [
    '',
    'Language: ReactJS + TS, Spring Boot',
    'During : 14/5/2021 - 24/5/2021',
    ''
];

/**
 * ErrorLoginPage

 *
 * Version 1.0
 *
 * Date: 06-10-2021
 *
 * Copyright
 *
 * Modification Logs:
 * DATE                 AUTHOR          DESCRIPTION
 * -----------------------------------------------------------------------
 * 06-10-2021	         LyNTT9           Create
 */
export const HomePage = () => {

    const [collapsed] = useState(false);
    
    return (
        <Layout id='components-layout-demo-custom-trigger' style={{ minHeight: '100vh' }}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="logo" />
                <Menu theme="dark" mode="inline">
                    {/*  defaultSelectedKeys={['2']} */}
                    <Menu.Item key="1" icon={<UserOutlined />}>
                        Account
                    </Menu.Item>
                    <Menu.Item key="2" icon={<RightOutlined />}>
                        <Link to={`/students`}>Students Information </Link>
                    </Menu.Item>
                    <Menu.Item key="3" icon={<RightOutlined />}>
                        <Link to={`/teachers`}>Teachers Information </Link>
                    </Menu.Item>
                    <Menu.Item key="4" icon={<RightOutlined />}>
                        <Link to={`/classes`}>Classes Information </Link>
                    </Menu.Item>
                    <Menu.Item key="5" icon={<RightOutlined />}>
                        <Link to={`/courses`}>Course Information </Link>
                    </Menu.Item>
                </Menu>
            </Sider>
            <div className="homepage-container">
                <div className=".divider-img">
                    <Image
                        width={300}
                        src={logo}
                    />
                </div>

                <div >
                    <Divider >Product: School Magement</Divider>
                    <List
                        size="small"
                        header={<div>Author: Truc Ly</div>}
                        footer={<div></div>}
                        bordered
                        dataSource={data}
                        renderItem={item => <List.Item>{item}</List.Item>}
                    />
                </div>
            </div>
        </Layout>
    )
}