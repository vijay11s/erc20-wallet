import crypto from "crypto-js";
var hexToBinary = require("hex-to-binary");
var binary = require("binary-to-decimal");
const elliptic = require("elliptic");
const ec = new elliptic.ec("secp256k1"); // use the secp256k1 curve

const { words } = require("./wordList");


// const entropy = crypto.lib.WordArray.random(32).toString();
const entropy = "cd1531e2b7ada27a011fb4960e2d0642"
const entropyBinary = hexToBinary(entropy);
// const entropyBinary = "01110010101100011101011111111000011010100101110100000011100111010111111001111110010000111010000010100101010000100010011110011100";
// const newEntopy =
//   "100101010000110111111101011000100111001010110100100010100101010001000010111100111010011011111000011101000000101011010111000100111001";
// console.log(entropyBinary, "ENTROPYBINARY");
const hash = crypto.SHA256(entropy);
const hashBinary = hexToBinary(hash.toString());
// console.log(hashBinary.split("").slice(0, 4).join(""), "CHECK SUM");
const hashFingerTip = hashBinary.split("").slice(0, 8).join("");
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

console.log(wordList.join(" "), "WORDLIST")

/*
Password: Mnemonic Sentence
Salt: "mnemonic"+(optional passphrase)
Iterations: 2048
Algorithm: HMAC-SHA512
Size: 64 bytes
*/

const password = wordList.join(" ");
const salt = "mnemonic";
const iterations = 2048;
const keySize = 16;
const seed = crypto
  .PBKDF2(password, salt, {
    keySize: keySize,
    iterations: iterations,
  })
  .toString();

console.log(seed);

// const seed = "fffcf9f6f3f0edeae7e4e1dedbd8d5d2cfccc9c6c3c0bdbab7b4b1aeaba8a5a29f9c999693908d8a8784817e7b7875726f6c696663605d5a5754514e4b484542"

const hmac = crypto.HmacSHA512(crypto.enc.Utf8.parse("Bitcoin seed"), seed);
const masterKey = crypto.enc.Hex.parse(
  hmac.toString(crypto.enc.Hex)
).toString();
const privateKey = masterKey.slice(0, 64);
const chainCode = masterKey.slice(64);
const keyPair = ec.keyFromPrivate(privateKey, "hex");
const publicKey = keyPair.getPublic("hex");
// const a = privateKey + chainCode + privateKey + chainCode
// console.log(publicKey);
// console.log(a.length);
// console.log(chainCode);
// console.log(privateKey + chainCode);
// console.log(chainCode.toString());
