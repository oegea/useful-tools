/** 
 * This file is part of Useful set of javascript tools.
 * https://github.com/oegea/useful
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
import sinon from 'sinon';
import LocalStorageDatabase from './index.js';

describe('@useful-tools/localstorage library tests', () => {

    const DEFAULT_COLLECTION = 'test';

    beforeEach(() => {
        localStorage.clear();
    })

    it('should set an entire collection to a specific value and then retrieve it', async () => {

        const value = [{ name: 'test_document'}];
        LocalStorageDatabase.setCollection(DEFAULT_COLLECTION, value);

        const currentCollectionValue = LocalStorageDatabase.getCollection(DEFAULT_COLLECTION);

        expect(currentCollectionValue).to.be.an('array');
        expect(currentCollectionValue).to.has.length(1);
        expect(currentCollectionValue[0]).to.be.an('object');
        expect(currentCollectionValue[0].name).to.eql('test_document');
    });

    it('should be able to create a new document, generating a random id if it has not one, and retrieve the document later', async () => {
        const document = {
            name: 'test_document'
        }

        LocalStorageDatabase.createDocument(DEFAULT_COLLECTION, document);
        const searchedDocument = LocalStorageDatabase.searchDocument(DEFAULT_COLLECTION, 'name', 'test_document');

        expect(searchedDocument).to.be.an('array');
        expect(searchedDocument).to.has.length(1);
        expect(searchedDocument[0]).to.be.an('object');
        expect(searchedDocument[0]).to.has.property('name');
        expect(searchedDocument[0]).to.has.property('id');
        expect(searchedDocument[0].name).to.eql('test_document');
    });

    it('should be able to entirely replace a document by another one different', async () => {
        const initialDocument = {
            name: 'John Doe',
            job: 'Developer'
        }

        const replaceDocument = {
            name: 'John Doe',
            fanOf: 'Chuck Norris'
        }
        // Create the initial document
        LocalStorageDatabase.createDocument(DEFAULT_COLLECTION, initialDocument);
        // Then replace each document containing John Doe as name, by the replaceDocument
        LocalStorageDatabase.setDocument(DEFAULT_COLLECTION, replaceDocument, 'name', 'John Doe');

        const currentDocument = LocalStorageDatabase.searchDocument(DEFAULT_COLLECTION, 'name', 'John Doe');

        expect(currentDocument).to.be.an('array');
        expect(currentDocument).to.has.length(1);
        expect(currentDocument[0]).to.be.an('object');
        expect(currentDocument[0]).to.has.property('name');
        expect(currentDocument[0]).to.has.property('id');
        expect(currentDocument[0]).to.has.property('fanOf');
        expect(currentDocument[0]).to.not.has.property('job');
        expect(currentDocument[0].fanOf).to.eql('Chuck Norris')
    });

    it('should be able to partially update a document', async () => {
        const document = {
            name: 'John Doe',
            job: 'Developer',
            languages: ['Javascript', 'Golang', 'Swift'],
            phoneNumber: '722222222'
        }

        const updateDocument = {
            phoneNumber: '733333333'
        }

        LocalStorageDatabase.createDocument(DEFAULT_COLLECTION, document);
        LocalStorageDatabase.updateDocument(DEFAULT_COLLECTION, updateDocument, 'name', 'John Doe');

        const currentDocument = LocalStorageDatabase.searchDocument(DEFAULT_COLLECTION, 'name', 'John Doe');
        expect(currentDocument).to.be.an('array');
        expect(currentDocument).to.has.length(1);
        expect(currentDocument[0]).to.be.an('object');
        expect(currentDocument[0]).to.has.property('name');
        expect(currentDocument[0]).to.has.property('job');
        expect(currentDocument[0]).to.has.property('languages');
        expect(currentDocument[0]).to.has.property('phoneNumber');
        expect(currentDocument[0].phoneNumber).to.eql('733333333');
    });

    it ('should be able to delete an entire collection', async () => {
        const value = [{ name: 'test_document'}];

        LocalStorageDatabase.setCollection(DEFAULT_COLLECTION, value);
        const initialCollectionValue = LocalStorageDatabase.getCollection(DEFAULT_COLLECTION);
        LocalStorageDatabase.deleteCollection(DEFAULT_COLLECTION);
        const postDeleteCollectionValue = LocalStorageDatabase.getCollection(DEFAULT_COLLECTION);

        expect(initialCollectionValue).to.be.an('array');
        expect(initialCollectionValue).to.has.length(1);
        expect(postDeleteCollectionValue).to.be.an('array');
        expect(postDeleteCollectionValue).to.has.length(0);
    });

    it ('should be able to delete an entire collection', async () => {
        const value = [{ name: 'test_document'}];

        LocalStorageDatabase.setCollection(DEFAULT_COLLECTION, value);
        const initialCollectionValue = LocalStorageDatabase.getCollection(DEFAULT_COLLECTION);
        LocalStorageDatabase.deleteCollection(DEFAULT_COLLECTION);
        const postDeleteCollectionValue = LocalStorageDatabase.getCollection(DEFAULT_COLLECTION);

        expect(initialCollectionValue).to.be.an('array');
        expect(initialCollectionValue).to.has.length(1);
        expect(postDeleteCollectionValue).to.be.an('array');
        expect(postDeleteCollectionValue).to.has.length(0);
    });

    it('should be able to delete a document', async() => {
        const document = {
            name: 'test_document'
        }

        LocalStorageDatabase.createDocument(DEFAULT_COLLECTION, document);
        const existingDocument = LocalStorageDatabase.searchDocument(DEFAULT_COLLECTION, 'name', 'test_document');
        LocalStorageDatabase.deleteDocument(DEFAULT_COLLECTION, 'name', 'test_document');
        const nonExistingDocument = LocalStorageDatabase.searchDocument(DEFAULT_COLLECTION, 'name', 'test_document');

        expect(existingDocument).to.be.an('array');
        expect(existingDocument).to.have.length(1);
        expect(nonExistingDocument).to.be.an('array');
        expect(nonExistingDocument).to.have.length(0);
    });

    it('should be able to send notifications to subscribers when a specific collection is altered', async ()=>{
        const defaultDocument = {test: 'document'};
        LocalStorageDatabase.createDocument(DEFAULT_COLLECTION, defaultDocument);

        const callback = sinon.stub();
        const unsubscribe = LocalStorageDatabase.subscribeToLocalStorage(DEFAULT_COLLECTION, callback);

        const document = {
            name: 'new_document'
        }
        LocalStorageDatabase.createDocument(DEFAULT_COLLECTION, document);
        LocalStorageDatabase.deleteDocument(DEFAULT_COLLECTION, 'name', 'new_document');
        unsubscribe();

        expect(callback.callCount).to.eql(2);
        expect(callback.getCall(0).calledWithExactly([defaultDocument, document])).to.eql(true);
        expect(callback.getCall(1).calledWithExactly([defaultDocument])).to.eql(true);
    });

});