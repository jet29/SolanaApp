import React, { FC, useState} from 'react';
import { SendOzoneToken } from './SendOzoneToken';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';

import { Layout, Menu, Typography, Row, Col, Form, Input, Button  } from 'antd';
const { Title } = Typography;


const { Header, Footer, Sider, Content } = Layout;

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');



export const App: FC = () => {

    const [current, setCurrent] = useState('');

    let handleClick = (e : any) => {
        console.log('click ', e);
        setCurrent(e.key);
    };

    let onFinish = () =>{

    }

    let onFinishFailed = () =>{

    }

    return (
        <WalletModalProvider>
            <Layout>
                <Header>
                    <Row>
                        <Col span={4}>
                            <WalletMultiButton />
                        </Col>
                        <Col span={4}>
                            <WalletDisconnectButton />
                        </Col>
                    </Row>
                </Header>
                <Layout>
                    <Sider>
                        <Menu onClick={handleClick} selectedKeys={[current]} >
                            <Menu.Item key="get-ozone-tokens">
                                Get Ozone Tokens
                            </Menu.Item>
                        </Menu>
                    </Sider>
                    <Content>
                        {
                            current === "get-ozone-tokens" &&
                            <Row>
                                <SendOzoneToken/>
                            </Row>
                        }
                    </Content>
                </Layout>
                <Footer>Footer</Footer>
            </Layout>
        </WalletModalProvider>
    );
};

