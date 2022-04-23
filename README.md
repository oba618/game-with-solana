# GAME WITH SOLANA

## 概要

このレポジトリは、Solana上でtransferを実施するテストプロジェクトです。

## 実施方法

1. `index.js`が存在するディレクトリに`secretKeys.js`を作成します。
2. `secretKeys.js`内に、`playerSecretKey`と`ownerSecretKey`を設定し、`exports`しておきます。

```js
// secretKeys.js (例)
exports.playerSecretKey = [111,222,333, ...];
exports.ownerSecretKey = [111,222,333, ...];
```

3. `node index.js`または、`npm run index.js`で実行します。

## 制作者

- oba618
