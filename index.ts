import crypto from "crypto-js";
var hexToBinary = require('hex-to-binary');
var binary = require('binary-to-decimal')

const {words} = require('./wordList');

const entropy = crypto.lib.WordArray.random(16).toString();
const entropyBinary = hexToBinary(entropy)
const hash = crypto.SHA256(entropy);
const hashBinary = hexToBinary(hash.toString());
const hashFingerTip = hashBinary.split("").slice(0, 4).join("")
const newEntopy = entropyBinary + hashFingerTip;

let i = 0;
let j = 11;




const arr = [];
while (j <= newEntopy.length) {
  const a = newEntopy.split("");
  const data = a.slice(i, j).join("");
  arr.push(data);
  i += 11;
  j += 11;
}

const wordList = [];
for (let i = 0; i < arr.length; i++) {
  const decimal = binary.decimal(arr[i]);
  wordList.push(words[decimal]);
}

/*
Password: Mnemonic Sentence
Salt: "mnemonic"+(optional passphrase)
Iterations: 2048
Algorithm: HMAC-SHA512
Size: 64 bytes
*/


const password = wordList.join(" ");
const salt = 'mnemonic';
const iterations = 2048;
const keySize = 512;
const key = crypto.PBKDF2(password, salt, { keySize: keySize / 32, iterations: iterations });

console.log(key.toString());
