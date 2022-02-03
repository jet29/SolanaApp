import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import * as web3 from '@solana/web3.js'; 
import * as splToken from "@solana/spl-token";
import { FC } from 'react';
import axios from 'axios';
import { Button, Row, Col } from 'antd';

export const TransferTokenCluster: FC = () => {
    const { connection } = useConnection();
    const { publicKey, signTransaction } = useWallet();

    let AdminToUser = async () => {
        const data = { publicKey: publicKey?.toString() };
        axios.post('http://localhost:3001/solana/send', data)
            .then(response => {
                console.log(response);
        });
    };

    let UserToAdmin = async () => {

        if(publicKey !== null && signTransaction){
            const data = { publicKey: publicKey?.toString() };
            
            let response = await axios.post('http://localhost:3001/solana/receive', data);

            const fromTokenAccountAddress = response.data.fromTokenAccountAddress;
            const toTokenAccountAddress = response.data.toTokenAccountAddress;

            const associatedTokenAccountFrom = new web3.PublicKey(fromTokenAccountAddress);
            const associatedTokenAccountTo = new web3.PublicKey(toTokenAccountAddress);

            var transaction = new web3.Transaction()
                .add(
                    splToken.Token.createTransferInstruction(
                        splToken.TOKEN_PROGRAM_ID,
                        associatedTokenAccountTo,
                        associatedTokenAccountFrom,
                        publicKey,
                        [],
                        1 * LAMPORTS_PER_SOL
                    )
                );

            const blockHash = await connection.getRecentBlockhash();
            transaction.feePayer = await publicKey;
            transaction.recentBlockhash = await blockHash.blockhash;
            const signed = await signTransaction(transaction);

            await connection.sendRawTransaction(signed.serialize());
        }        
    };

    return (
        <Row>
            <Col span={4}>
                <Button type="primary" onClick={()=>{UserToAdmin()}} disabled={!publicKey}>
                        Send Ozone Tokens
                </Button>
            </Col>
            <Col span={4}>
                <Button type="primary" onClick={()=>{AdminToUser()}} disabled={!publicKey}>
                    Get Ozone Tokens
                </Button>
            </Col>
        </Row> 
    );
};