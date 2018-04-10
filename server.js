let fs = require('fs');
let db = require('./db.js');
let express = require('express')
let app = express()
let bodyParser = require('body-parser');

let contacts = [{
  "name": "robby",
  // "number": "7062027841",
  "email": "rcackerley@me.com",
  "id": 1
}];

let lastID = 1;

let getRequestedEntry = (itemId, request) => {
  return db.query(`SELECT * from contacts where id = ${itemId}`);
}

let updateEntry = (newContentForContact, itemId, key) => {
  return db.query(`UPDATE contacts set ${key} = '${newContentForContact[key]}' where id = ${itemId}; `)
  }

let addNewContact = (contact) => {
  console.log(contact.name);
  return db.query(`INSERT INTO contacts(name, email) VALUES ('${contact.name}','${contact.email}');`);

}

let deleteContact = (request, response) => {
  let itemId = request.params.id;
  var deleteEntryPromise = db.query(`DELETE from contacts where id = ${itemId}`);
  deleteEntryPromise.then(results => {
    response.end('item deleted');
  })
}

let getContact = (request, response) => {
  let itemId = request.params.id;
  console.log(itemId);
  let requestedEntry = getRequestedEntry(itemId, request);
  requestedEntry.then(results => {
    console.log(results[0]);
    response.send(JSON.stringify(results[0]));

  })
}

let getContacts = (request, response) => {
  var getContactsPromise = db.query('SELECT * from contacts;');
  getContactsPromise.then(results => {
    response.send(JSON.stringify(results));
  })
};

let postContacts = (request, response) => {
    var newContactPromise = addNewContact(request.body);
    newContactPromise.then(results => {response.send('Got it!')})
    .catch(results => {console.log(results)});
}

let putContact = (request, response) => {
    let itemId = request.params.id;
    console.log(request.body);
    for (let key in request.body) {
      let editContactPromise = updateEntry(request.body, itemId, key)
      .then(results => {response.send('Got it!')});
    }
}
let renderFile = (request, response) => {
  var fileName = request.url.slice(1);
  // console.log(fileName);
  fs.readFile(fileName, 'utf-8', (err, data) => {
    if (err) {
        data = err;
    }
    console.log(typeof data);
    response.end(data);
  })
}

app.get('/contacts/:id', getContact);
app.get('/contacts', getContacts);
app.use(bodyParser.json())
app.post('/contacts', postContacts);
app.delete('/contacts/:id', deleteContact);
app.put('/contacts/:id', putContact);
app.get('*', renderFile);
app.listen(3000, () => console.log('Example app listening on port 3000!'))
