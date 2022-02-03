var express = require('express');
var router = express.Router();
var exec = require('child_process').exec;

/* not used but still here just in case is needed*/
router.post('/', function(req, res, next) {
    console.log("sending solana tokens to")
    console.log('Got body:', req.body);

    const walletAddr = req.body.addr;

    try{
        let shellCommand = `spl-token transfer GKSTneWi9dDGwCc7M8y2cWvGZpmxEpj1a8eSMCZXDWAE 50 ${walletAddr} --allow-unfunded-recipient --fund-recipient`;

        exec(shellCommand,
            function (error, stdout, stderr) {
                console.log('stdout: ' + stdout);
                console.log('stderr: ' + stderr);
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            }
        );
    }catch(e){
        console.log("error transfering tokens", e);
    }
    
    res.send("response");
});


router.post('/send', function(req, res, next) {

    const sendPublicKey = req.body.publicKey;

    try{
        if(sendPublicKey !== null){

            const WALLET_SECRET_KEY = new Uint8Array([45,244,159,225,254,84,121,30,53,141,213,11,111,248,156,235,123,125,247,68,161,149,133,238,121,114,81,173,62,231,32,98,219,80,162,228,85,132,118,183,255,42,91,176,203,223,27,204,140,22,131,229,122,246,84,31,93,242,31,104,191,190,230,71]);
    
            // Connect to cluster
            let connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');
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
    
            res.send("Success");
    
        }

    }catch(e){
        res.send("error");
    }

    
});

router.post('/receive', function(req, res, next) {
    if(publicKey !== null && signTransaction){

        const WALLET_SECRET_KEY = new Uint8Array([45,244,159,225,254,84,121,30,53,141,213,11,111,248,156,235,123,125,247,68,161,149,133,238,121,114,81,173,62,231,32,98,219,80,162,228,85,132,118,183,255,42,91,176,203,223,27,204,140,22,131,229,122,246,84,31,93,242,31,104,191,190,230,71]);
    
        // Connect to cluster
        let connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');
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

    }
});



module.exports = router;
