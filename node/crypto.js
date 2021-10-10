// 检测是否支持 crypto
let crypto;
try {
  crypto = require('crypto');
} catch (err) {
  console.log('不支持 crypto');
}

// Certificate 类 证书签名请求机制
const { Certificate } = require('crypto');
// 返回 spkac 数据结构的 challenge 部分， spkac 包含一个公钥和一个 challange
// Certificate.exportChallenge(spkac)
console.log(Certificate.exportChallenge(getSpkacSomehow()).toString('utf8'));
// 返回 spkac 数据结构的 公钥 部分
// Certificate.exportPublicKey(spkac[, encoding])


// Cipher 类  加密数据
const crypto = require('crypto');

const algorithm = 'aes-192-cbc';
const password = '用于生成密钥的密码';
// 密钥长度取决于算法。 
// 在此示例中，对于 aes192，它是 24 个字节（192 位）。
// 改为使用异步的 `crypto.scrypt()`。
const key = crypto.scryptSync(password, '盐值', 24);
// 使用 `crypto.randomBytes()` 生成随机的 iv 而不是此处显示的静态的 iv。
const iv = Buffer.alloc(16, 0); // 初始化向量。

const cipher = crypto.createCipheriv(algorithm, key, iv);

// 1. Cipher 对象作为流
let encrypted = '';
cipher.on('readable', () => {
  let chunk;
  while (null !== (chunk = cipher.read())) {
    encrypted += chunk.toString('hex');
  }
});
cipher.on('end', () => {
  console.log(encrypted);
  // 打印: 9d47959b80d428936beef61216ef0b7653b5d23a670e082bd739f6cebcb6038f
});

cipher.write('要加密的数据');
cipher.end();
// 2. 管道流
const input = fs.createReadStream('要加密的数据.txt');
const output = fs.createWriteStream('加密后的数据.enc');

input.pipe(cipher).pipe(output);

// cipher.final([outputEncoding])
// outputEncoding <string> 返回值的字符编码
// 返回: <Buffer> | <string> 任何剩余的加密内容。如果指定了 outputEncoding，则返回一个字符串。如果未提供 outputEncoding，则返回 Buffer。
// 一旦调用了 cipher.final() 方法，则 Cipher 对象就不能再用于加密数据。 如果试图多次调用 cipher.final()，则将会导致抛出错误。

// cipher.setAAD(buffer[, options])
// 用于经验证的加密模式添加额外授信数据  先于update调用

// cipher.getAuthTag()
// 包含已从给定数据计算后的认证标签的buffer 晚于final()调用

// cipher.setAutoPadding([autoPadding])
// 填充数据，适配相应块大小。非标准填充是有用的

// cipher.update(data[, inputEncoding][, outputEncoding])
// data <string> | <Buffer> | <TypedArray> | <DataView>
// inputEncoding <string> 数据的字符编码。
// outputEncoding <string> 返回值的字符编码。
// 返回: <Buffer> | <string>
// 使用 data 更新加密。 如果指定了 inputEncoding 参数，则 data 参数是使用了指定的字符编码的字符串。 如果未指定 inputEncoding 参数，则 data 必须是一个 Buffer、 TypedArray 或 DataView。 如果 data 是一个 Buffer、 TypedArray 或 DataView，则 inputEncoding 会被忽略。
// outputEncoding 指定了加密的数据的输出格式。 如果指定了 outputEncoding，则返回使用了指定的字符编码的字符串。 如果未提供 outputEncoding，则返回 Buffer。
// 可以使用新数据多次调用 cipher.update() 方法，直到 cipher.final() 被调用。 在 cipher.final() 之后调用 cipher.update() 将会导致抛出错误。


// Decipher 类   解密过程

// DiffieHellman   创建 Diffie-Hellman 键交换的工具
const crypto = require('crypto');
const assert = require('assert');

// 生成 Alice 的密钥。
const alice = crypto.createDiffieHellman(2048);
const aliceKey = alice.generateKeys();

// 生成 Bob 的密钥。
const bob = crypto.createDiffieHellman(alice.getPrime(), alice.getGenerator());
const bobKey = bob.generateKeys();

// 交换并生成密钥。
const aliceSecret = alice.computeSecret(bobKey);
const bobSecret = bob.computeSecret(aliceKey);

// 完成。
assert.strictEqual(aliceSecret.toString('hex'), bobSecret.toString('hex'));


// diffieHellman.computeSecret(otherPublicKey[, inputEncoding][, outputEncoding])
// otherPublicKey <string> | <Buffer> | <TypedArray> | <DataView>
// inputEncoding <string> The encoding of an otherPublicKey string.
// outputEncoding <string> The encoding of the return value.

// diffieHellman.generateKeys([encoding])
// diffieHellman.getGenerator([encoding])
// .getPrime([encoding])  
// .getPrivateKey([encoding])  .setPrivateKey(privateKey[, encoding])
// diffieHellman.getPublicKey([encoding])  .setPublicKey(publicKey[, encoding])

// ECDH 类  创建椭圆曲线 Elliptic Curve Diffie-Hellman（ECDH）键交换的实用工具  用法同DiffieHellman
// ECDH.convertKey(key, curve[, inputEncoding[, outputEncoding[, format]]])
// key <string> | <Buffer> | <TypedArray> | <DataView>
// curve <string>
// inputEncoding <string> The encoding of the key string.
// outputEncoding <string> The encoding of the return value.
// format <string> Default: 'uncompressed'
const { createECDH, ECDH } = require('crypto');

const ecdh = createECDH('secp256k1');
ecdh.generateKeys();

const compressedKey = ecdh.getPublicKey('hex', 'compressed');

const uncompressedKey = ECDH.convertKey(compressedKey,
                                        'secp256k1',
                                        'hex',
                                        'hex',
                                        'uncompressed');

// The converted key and the uncompressed public key should be the same
console.log(uncompressedKey === ecdh.getPublicKey('hex'));

// Hash 类   创建数据的哈希摘要
const crypto = require('crypto');
const hash = crypto.createHash('sha256');

hash.on('readable', () => {
  // 哈希流只会生成一个元素。
  const data = hash.read();
  if (data) {
    console.log(data.toString('hex'));
    // 打印:
    //   164345eba9bccbafb94b27b8299d49cc2d80627fc9995b03230965e6d8bcbf56
  }
});

hash.write('要创建哈希摘要的数据');
hash.end();

// 管道流
const crypto = require('crypto');
const fs = require('fs');
const hash = crypto.createHash('sha256');

const input = fs.createReadStream('要创建哈希摘要的数据.txt');
input.pipe(hash).pipe(process.stdout);

// update
const crypto = require('crypto');
const hash = crypto.createHash('sha256');

hash.update('要创建哈希摘要的数据');
console.log(hash.digest('hex'));

// hash.digest([encoding])   计算摘要  多次调用抛出异常
// hash.update(data[, inputEncoding]) 可多次使用

// Hmac 类 同hash
// Sign 类  生成签名
const crypto = require('crypto');

const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
  namedCurve: 'sect239k1'
});

const sign = crypto.createSign('SHA256');
sign.write('要生成签名的数据');
sign.end();
const signature = sign.sign(privateKey, 'hex');

const verify = crypto.createVerify('SHA256');
verify.write('要生成签名的数据');
verify.end();
console.log(verify.verify(publicKey, signature));
// 打印 true 或 false。
//  sign.update() 和 verify.update()
const verify = crypto.createVerify('SHA256');
verify.update('要生成签名的数据');
verify.end();
console.log(verify.verify(publicKey, signature));

// sign.sign(privateKey[, outputEncoding])

// Verify 类  验证签名
// verify.verify(object, signature[, signatureEncoding])
// crypto.randomBytes(size[, callback])    生成加密强伪随机数据

// crypto.scrypt(password, salt, keylen[, options], callback)