import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, SystemProgram, Transaction, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import * as web3 from '@solana/web3.js'; 
import * as splToken from "@solana/spl-token";
import React, { FC, useCallback } from 'react';
import axios from 'axios';
import { Button, Row, Col } from 'antd';
import { uint8ArrayToBuffer } from '@solana/buffer-layout';

export const SendOzoneToken: FC = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction, signTransaction } = useWallet();

    async function findAssociatedTokenAddress(
        walletAddress: web3.PublicKey,
        tokenMintAddress: web3.PublicKey
    ): Promise<web3.PublicKey> {
        return (await PublicKey.findProgramAddress(
            [
                walletAddress.toBuffer(),
                splToken.TOKEN_PROGRAM_ID.toBuffer(),
                tokenMintAddress.toBuffer(),
            ],
            splToken.TOKEN_PROGRAM_ID
        ))[0];
    }

    let AdminToUser = async () => {

        if(publicKey !== null && signTransaction){

            const WALLET_SECRET_KEY = new Uint8Array([45,244,159,225,254,84,121,30,53,141,213,11,111,248,156,235,123,125,247,68,161,149,133,238,121,114,81,173,62,231,32,98,219,80,162,228,85,132,118,183,255,42,91,176,203,223,27,204,140,22,131,229,122,246,84,31,93,242,31,104,191,190,230,71]);
    
            // Construct wallet keypairs
            var adminWallet = web3.Keypair.fromSecretKey(WALLET_SECRET_KEY);
            var myMint = new web3.PublicKey("GKSTneWi9dDGwCc7M8y2cWvGZpmxEpj1a8eSMCZXDWAE");
    
            var myToken = new splToken.Token(
                connection,
                myMint,
                splToken.TOKEN_PROGRAM_ID,
                adminWallet
            );
            
            // Create associated token accounts for my token if they don't exist yet
            var fromTokenAccount = await myToken.getOrCreateAssociatedAccountInfo(
                adminWallet.publicKey
            )
            var toTokenAccount = await myToken.getOrCreateAssociatedAccountInfo(
                publicKey
            )

            // Add token transfer instructions to transaction
            var transaction = new web3.Transaction()
            .add(
                splToken.Token.createTransferInstruction(
                    splToken.TOKEN_PROGRAM_ID,
                    fromTokenAccount.address,
                    toTokenAccount.address,
                    adminWallet.publicKey,
                    [],
                    1 * LAMPORTS_PER_SOL
                )
            );
            // Sign transaction, broadcast, and confirm
            var signature = await web3.sendAndConfirmTransaction(
                connection,
                transaction,
                [adminWallet]
            );

            console.log("SIGNATURE", signature);
            console.log("SUCCESS");

        }
    };

    let UserToAdminBackend = async () => {

        
        if(publicKey !== null && signTransaction){

            const publicRawTo = new Uint8Array([32187183,32187183,32187183,32187183]);
            const associatedTokenAccountTo = new web3.PublicKey(publicRawTo);

            const publicRawFrom = new Uint8Array([32187183,32187183,32187183,32187183]);
            const associatedTokenAccountFrom = new web3.PublicKey(publicRawFrom);


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

            const blockHash = await connection.getRecentBlockhash()
            transaction.feePayer = await publicKey
            transaction.recentBlockhash = await blockHash.blockhash
            const signed = await signTransaction(transaction)

            await connection.sendRawTransaction(signed.serialize())

        }
    };

    let UserToAdmin = async () => {

        if(publicKey !== null && signTransaction){

            const WALLET_SECRET_KEY = new Uint8Array([45,244,159,225,254,84,121,30,53,141,213,11,111,248,156,235,123,125,247,68,161,149,133,238,121,114,81,173,62,231,32,98,219,80,162,228,85,132,118,183,255,42,91,176,203,223,27,204,140,22,131,229,122,246,84,31,93,242,31,104,191,190,230,71]);
    
            // Construct wallet keypairs
            var adminWallet = web3.Keypair.fromSecretKey(WALLET_SECRET_KEY);
            var myMint = new web3.PublicKey("GKSTneWi9dDGwCc7M8y2cWvGZpmxEpj1a8eSMCZXDWAE");
    
            var myToken = new splToken.Token(
                connection,
                myMint,
                splToken.TOKEN_PROGRAM_ID,
                adminWallet
            );

            // Create associated token accounts for my token if they don't exist yet
            var fromTokenAccount = await myToken.getOrCreateAssociatedAccountInfo(
                adminWallet.publicKey
            )
            var toTokenAccount = await myToken.getOrCreateAssociatedAccountInfo(
                publicKey
            )

            console.log("VIENDO ENDO");
            console.log(publicKey);
            console.log(toTokenAccount.address);
        
            var transaction = new web3.Transaction()
            .add(
                splToken.Token.createTransferInstruction(
                    splToken.TOKEN_PROGRAM_ID,
                    toTokenAccount.address,
                    fromTokenAccount.address,
                    publicKey,
                    [],
                    1 * LAMPORTS_PER_SOL
                )
            );

            const blockHash = await connection.getRecentBlockhash();
            transaction.feePayer = await publicKey;
            transaction.recentBlockhash = await blockHash.blockhash;
            const signed = await signTransaction(transaction)
            await connection.sendRawTransaction(signed.serialize());

        }
    };

    return (
        <>
            <Button type="primary" onClick={()=>{UserToAdmin()}} disabled={!publicKey}>
                    Send Ozone Tokens
            </Button>
            <Row>
                <Button type="primary" onClick={()=>{AdminToUser()}} disabled={!publicKey}>
                    Get Ozone Tokens
                </Button>
            </Row>
        </> 
    );
};