/** 
 * This file is part of Passager Password Manager.
 * https://github.com/oegea/passager-password-manager
 * 
 * Copyright (C) 2022 Oriol Egea Carvajal
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import {expect} from 'chai';

describe('Crypto library tests', () => {

    const DEFAULT_PASSWORD = 'testPassword123A!NcA';

    let cryptoLib = require('./index.js');

    it('should derive an aes key from a password string', async () => {
        const salt = cryptoLib.generateSalt();
        const aesKey = await cryptoLib.deriveKeyFromPassword(DEFAULT_PASSWORD, salt, ['encrypt']);
        expect(aesKey).to.be.an('CryptoKey');
    });

    it('should be able to encrypt and decrypt data simetrically using a password', async () => {
        const secretData = 'test data';
        const encryptedData = await cryptoLib.encrypt(secretData, DEFAULT_PASSWORD);
        const decryptedData = await cryptoLib.decrypt(encryptedData, DEFAULT_PASSWORD);
        expect(encryptedData).to.be.a('string');
        expect(decryptedData).to.eql(secretData);
    });

    it('should be able to generate a new RSA key', async ()=>{
        const keyPair = await cryptoLib.createRSAKeyPair();
        expect(keyPair).to.be.an('object');
        expect(keyPair.publicKey).to.be.a('CryptoKey');
        expect(keyPair.privateKey).to.be.a('CryptoKey');
    });

    it('should be able to generate a new wrapped RSA key-pair', async ()=>{
        const keyPair = await cryptoLib.createExportableRSAKeyPair(DEFAULT_PASSWORD);
        expect(keyPair).to.be.an('object');
        expect(keyPair.publicKey).to.be.a('string');
        expect(keyPair.privateKey).to.be.a('string');
    });

    it('should be able to import and decrypt an RSA key-pair', async ()=>{
        const keyPair = await cryptoLib.createExportableRSAKeyPair(DEFAULT_PASSWORD);
        
        const unwrappedKey = await cryptoLib.importRSAKeyPair(keyPair, DEFAULT_PASSWORD);
        expect(unwrappedKey).to.be.an('object');
        expect(unwrappedKey.publicKey).to.be.a('CryptoKey');
        expect(unwrappedKey.privateKey).to.be.a('CryptoKey');
    });

    it('should be able to encrypt and decrypt data asimetrically with RSA', async ()=>{
        const dataToEncrypt = 'test data';
        const keyPair = await cryptoLib.createRSAKeyPair();
        const encryptedData = await cryptoLib.RSAEncrypt(dataToEncrypt, keyPair.publicKey);
        const decryptedData = await cryptoLib.RSADecrypt(encryptedData, keyPair.privateKey);
        expect(encryptedData).to.be.a('string');
        expect(decryptedData).to.eql(dataToEncrypt);
    });

    it('should be able to generate a random AES key, and encrypt/decrypt it using RSA', async ()=>{
        const keyPair = await cryptoLib.createRSAKeyPair();
        const encryptedAESKey = await cryptoLib.generateExportableAESKey(keyPair.publicKey);
        const decryptedAESKey = await cryptoLib.importAESKey(encryptedAESKey, keyPair.privateKey);

        expect(encryptedAESKey).to.be.a('string');
        expect(decryptedAESKey).to.be.a('CryptoKey');
        // We can use the decrypted key to encrypt and decrypt data 
        const dataToEncrypt = 'test data';
        const encryptedData = await cryptoLib.encrypt(dataToEncrypt, decryptedAESKey);
        const decryptedData = await cryptoLib.decrypt(encryptedData, decryptedAESKey);
        expect(encryptedData).to.be.a('string');
        expect(decryptedData).to.eql(dataToEncrypt);
        
    });
});