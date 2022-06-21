# Localstorage

This package is designed to use localstorage as if it were a no-sql database, allowing to subscribe to changes.

## Available methods

Please refer to integration tests to know how the library works.

### It should set an entire collection to a specific value and then retrieve it

```javascript
import LocalStorageDatabase from '@useful-tools/localstorage'

const DEFAULT_COLLECTION = 'test';
const value = [{ name: 'test_document'}];
LocalStorageDatabase.setCollection(DEFAULT_COLLECTION, value);

const currentCollectionValue = LocalStorageDatabase.getCollection(DEFAULT_COLLECTION);

expect(currentCollectionValue).to.be.an('array');
expect(currentCollectionValue).to.has.length(1);
expect(currentCollectionValue[0]).to.be.an('object');
expect(currentCollectionValue[0].name).to.eql('test_document');
```

### It should be able to create a new document, generating a random id if it has not one, and retrieve the document later

```javascript
import LocalStorageDatabase from '@useful-tools/localstorage'

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
```
### It should be able to entirely replace a document by another one different

```javascript
import LocalStorageDatabase from '@useful-tools/localstorage'

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
expect(currentDocument[0].fanOf).to.eql('Chuck Norris');
```

### It should be able to partially update a document

```javascript
import LocalStorageDatabase from '@useful-tools/localstorage'

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
```

### It should be able to delete an entire collection

```javascript
import LocalStorageDatabase from '@useful-tools/localstorage'

const value = [{ name: 'test_document'}];

LocalStorageDatabase.setCollection(DEFAULT_COLLECTION, value);
const initialCollectionValue = LocalStorageDatabase.getCollection(DEFAULT_COLLECTION);
LocalStorageDatabase.deleteCollection(DEFAULT_COLLECTION);
const postDeleteCollectionValue = LocalStorageDatabase.getCollection(DEFAULT_COLLECTION);

expect(initialCollectionValue).to.be.an('array');
expect(initialCollectionValue).to.has.length(1);
expect(postDeleteCollectionValue).to.be.an('array');
expect(postDeleteCollectionValue).to.has.length(0);
```

### It should be able to delete an entire collection

```javascript
import LocalStorageDatabase from '@useful-tools/localstorage'

const value = [{ name: 'test_document'}];

LocalStorageDatabase.setCollection(DEFAULT_COLLECTION, value);
const initialCollectionValue = LocalStorageDatabase.getCollection(DEFAULT_COLLECTION);
LocalStorageDatabase.deleteCollection(DEFAULT_COLLECTION);
const postDeleteCollectionValue = LocalStorageDatabase.getCollection(DEFAULT_COLLECTION);

expect(initialCollectionValue).to.be.an('array');
expect(initialCollectionValue).to.has.length(1);
expect(postDeleteCollectionValue).to.be.an('array');
expect(postDeleteCollectionValue).to.has.length(0);
```

### It should be able to delete a document

```javascript
import LocalStorageDatabase from '@useful-tools/localstorage'

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
```

### It should be able to send notifications to subscribers when a specific collection is altered

```javascript
import LocalStorageDatabase from '@useful-tools/localstorage'

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
```