# Crypto

This package is designed to make easier to perfom some basic operations using the Crypto Web API.

## Available methods

### deriveKeyFromPassword

Derives an AES key from a password.

```javascript
import {generateSalt, deriveKeyFromPassword} from '@useful-tools/crypto'

const DEFAULT_PASSWORD = 'testPassword123A!NcA';
const salt = cryptoLib.generateSalt();
const aesKey = await cryptoLib.deriveKeyFromPassword(DEFAULT_PASSWORD, salt, ['encrypt']);
```

### createRSAKeyPair

Generates a new RSA key pair.

```javascript
import {createRSAKeyPair} from '@useful-tools/crypto'

const keyPair = await createRSAKeyPair();
console.log(keyPair.publicKey, keyPair.privateKey)
```

### encrypt, decrypt

Encrypts or decrypts using a plain password.

```javascript
import {encrypt, decrypt} from '@useful-tools/crypto'

const DEFAULT_PASSWORD = 'testPassword123A!NcA';
const secretData = 'test data';
const encryptedData = await encrypt(secretData, DEFAULT_PASSWORD);
const decryptedData = await decrypt(encryptedData, DEFAULT_PASSWORD);
```

### createExportableRSAKeyPair

Generates a RSA key pair and wraps and encrypts it using a plain password, so it can be easily shared as long as the provided password is safe.

```javascript
import {createExportableRSAKeyPair} from '@useful-tools/crypto'

const DEFAULT_PASSWORD = 'testPassword123A!NcA';
const keyPair = await createExportableRSAKeyPair(DEFAULT_PASSWORD);
console.log(keyPair.publicKey, keyPair.privateKey)
```

### importRSAKeyPair

Imports a RSA key pair that has been wrapped and encrypted using the `createExportableRSAKeyPair` method.

```javascript
import {createExportableRSAKeyPair, importRSAKeyPair} from '@useful-tools/crypto'

const DEFAULT_PASSWORD = 'testPassword123A!NcA';
const keyPair = await createExportableRSAKeyPair(DEFAULT_PASSWORD);
const unwrappedKey = await importRSAKeyPair(keyPair, DEFAULT_PASSWORD);

console.log(keyPair.publicKey, keyPair.privateKey)
```

### RSAEncrypt, RSADecrypt

Asimetrically encrypts and decrypts using a RSA key pair.

```javascript
import {createRSAKeyPair, RSAEncrypt, RSADecrypt} from '@useful-tools/crypto'

const dataToEncrypt = 'test data';
const keyPair = await createRSAKeyPair();
const encryptedData = await RSAEncrypt(dataToEncrypt, keyPair.publicKey);
const decryptedData = await RSADecrypt(encryptedData, keyPair.privateKey);

console.log(encryptedData, decryptedData)
```

### generateExportableAESKey, importAESKey

Generates an AES key exported and encrypted with an RSA public key.
And, imports and decrypts its using the RSA private key.

```javascript
import {createRSAKeyPair, generateExportableAESKey, importAESKey} from '@useful-tools/crypto'

const keyPair = await createRSAKeyPair();
const encryptedAESKey = await generateExportableAESKey(keyPair.publicKey);
const decryptedAESKey = await importAESKey(encryptedAESKey, keyPair.privateKey);

console.log('decryptedAESKey can be used now with the encrypt and decrypt method');
```