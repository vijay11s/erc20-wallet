import Web3 from "web3";
import {
  pubToAddress,
  publicToAddress,
  privateToPublic,
  privateToAddress,
  isValidPublic,
  isValidPrivate,
} from "ethereumjs-util";
const bip39 = require('bip39');

// import bip39 from "bip39";
import hdkey from "hdkey";
import crypto from "crypto";
// const bip39 = require("bip39");
// const hdkey = require("hdkey");

// const web3 = new Web3(Web3.givenProvider);
// const privateKey =
//   "0xee837429ac9aea98c5db9e2f337609884ba3ad647967efd21ac78a95f4c49a5c";
// const publicKey =
//   "0xbf200cbda807a74b6961593d1168f51e0de501c97c376b2d46b733d7a835a2e04d692f64b039d4a2488f1ebea52f836d2cf82dad2b7d6c4a664e02693fe52b56";
// const address = "0xFf47503845E91b902B46E62824Fbd3a4D122716c";

// function createAccount(entropy?: string) {
//   if (entropy && entropy.length !== 32) {
//     return "Entropy should of 32 chars";
//   }
//   return web3.eth.accounts.create(entropy || "");
// }

// function accountByPrivateKey(privateKey: string) {
//   if (privateKey) {
//     return web3.eth.accounts.privateKeyToAccount(privateKey);
//   }
//   return "Please pass private key";
// }

// function privateKeyToPublickey(privateKey: string) {
//   if (!privateKey) {
//     return "Please pass private key";
//   }
//   const privateKeyBuffer = Buffer.from(privateKey.slice(2), "hex");
//   return `0x${privateToPublic(privateKeyBuffer).toString("hex")}`;
// }

// function publicKeyToAddress(publicKey: string) {
//   if (!publicKey) {
//     return "Please pass the public key";
//   }
//   const publicKeyBuffer = Buffer.from(publicKey.slice(2), "hex");
//   const address = `0x${publicToAddress(publicKeyBuffer).toString("hex")}`;
//   return address;
// }

function createAccount(passphrase?: string) {
  const salt = "";
  const password = passphrase || "";
  const iterations = 2048;
  const keylen = 16;
  const derivedKey = crypto.pbkdf2Sync(
    password,
    salt,
    iterations,
    keylen,
    "sha512"
  );
  const mnemonic = bip39.entropyToMnemonic(derivedKey);
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const root = hdkey.fromMasterSeed(seed);
  const addrNode = root.derive("m/44'/60'/0'/0/0");
  const pubKey = addrNode.publicKey;
  // const addr = pubToAddress(pubKey).toString('hex');
  const privateKey = addrNode.privateKey.toString('hex');
  return {
    derivedKey: derivedKey.toString('hex'),
    mnemonic,
    pubKey: pubKey.toString("hex"),
    // addr,
    privateKey
  }
}

const account = createAccount("Arushi@0401");
console.log(account)
