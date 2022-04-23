const inquirer = require("inquirer");
const chalk = require("chalk");
const figlet = require("figlet");
const web3 = require('@solana/web3.js');

// オーナとプレイやのシークレットキー
const secretKeys = require("./secretKeys.js")

// オーナとプレイやのウォレット
const playerWallet = web3.Keypair.fromSecretKey(
    Uint8Array.from(secretKeys.playerSecretKey));
const ownerWallet = web3.Keypair.fromSecretKey(
    Uint8Array.from(secretKeys.ownerSecretKey));

// 送金
const transferSOL = async (from,to,transferAmt) => {
    try {
        const connection = new web3.Connection(
            web3.clusterApiUrl("devnet"),
            "confirmed"
        );
        const transaction = new web3.Transaction().add(
            web3.SystemProgram.transfer({
                fromPubkey: new web3.PublicKey(from.publicKey.toString()),
                toPubkey: new web3.PublicKey(to.publicKey.toString()),
                lamports: transferAmt * web3.LAMPORTS_PER_SOL
            })
        );
        const signature = await web3.sendAndConfirmTransaction(
            connection,
            transaction,
            [from]
        );

        return signature;
    }
    catch (err) {
        console.log(err);
    }
}

// 標準入力
const askQuestions = () => {
    const questions = [
        {
            name: "SOL",
            type: "number",
            message: "投入するSOLを入力してください。（1 のみ）"
        },
        {
            name: "GUESS",
            type: "number",
            message: "予想するダイスの目を入力してください。（1 以上 6 以下）"
        }
    ]

    return inquirer.prompt(questions);
}

// タイトル表示
const showTitle = (title) => {
    console.log(
        chalk.yellow(
            figlet.textSync(title)
        )
    );
};

// 乱数
const generateRandomNumber = (min, max) => {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
}

// 実行
const execution = async () => {
    showTitle("DICE GAME");

    const answers = await askQuestions();

    // 入力が正しい場合
    if (answers.SOL === 1 && 1 <= answers.GUESS && answers.GUESS <= 6 ) {
        console.log("あなたは、1 SOL ベットしています。");
        
        console.log("ダイスを振ります。");
        const randomNumber = generateRandomNumber(1, 6);
        console.log(`ダイスの目は、${randomNumber} です。`)
        
        // 予想成功
        if (answers.GUESS === randomNumber) {
            transferSOL(ownerWallet, playerWallet, 2);
            console.log("予想成功！あなたは 2 SOL 獲得しました！");
        }

        else {
            transferSOL(playerWallet, ownerWallet, 1);
            console.log("予測失敗...。1 SOL 没収...");
        }
    }
    else {
        console.log("不正入力です。");
    }
}

execution();
