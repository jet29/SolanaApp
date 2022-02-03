import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import * as web3 from '@solana/web3.js'; 
import * as splToken from "@solana/spl-token";
import { FC } from 'react';
import axios from 'axios';
import { Button, Row } from 'antd';

export const SendOzoneToken: FC = () => {
    const { connection } = useConnection();
    const { publicKey, signTransaction } = useWallet();

    let AdminToUserBackend = async () => {
        const data = { publicKey: publicKey?.toString() };
        axios.post('http://localhost:3001/solana/send', data)
            .then(response => {
                console.log(response);
        });
    };

    let UserToAdminBackend = async () => {

        if(publicKey !== null && signTransaction){
            const data = { publicKey: publicKey?.toString() };
            
            let response = await axios.post('http://localhost:3001/solana/receive', data);
            console.log(response);

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
        <>
            <Button type="primary" onClick={()=>{UserToAdminBackend()}} disabled={!publicKey}>
                    Send Ozone Tokens
            </Button>
            <Row>
                <Button type="primary" onClick={()=>{AdminToUserBackend()}} disabled={!publicKey}>
                    Get Ozone Tokens
                </Button>
            </Row>
        </> 
    );
};