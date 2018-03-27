let http = require('http');
let fs = require('fs');
let db = require('./db.js');

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

let matches = (request, method, path) => {
  var match = path.exec(request.url);
  let matchArray = null;
  if (match != null) {
    matchArray = match.slice(1);
  }
  return request.method === method && matchArray;
}
let addNewContact = (contact) => {
  console.log(contact.name);
  return db.query(`INSERT INTO contacts(name, email) VALUES ('${contact.name}','${contact.email}');`);

}

let deleteContact = (request, response, id) => {
  let itemId = id[0];
  var deleteEntryPromise = db.query(`DELETE from contacts where id = ${itemId}`);
  deleteEntryPromise.then(results => {
    response.end('item deleted');
  })
}

let getContact = (request, response, id) => {
  let itemId = id[0];
  let requestedEntry = getRequestedEntry(itemId, request);
  requestedEntry.then(results => {
    console.log(results[0]);
    response.end(JSON.stringify(results[0]));

  })
}

let getContacts = (request, response) => {
  var getContactsPromise = db.query('SELECT * from contacts;');
  getContactsPromise.then(results => {
    response.end(JSON.stringify(results));
  })
};

let postContacts = (request, response) => {
  let body = '';
  request.on('data', (chunk) => {
    body += chunk.toString();
  });
  request.on('end', () => {
    let contact = JSON.parse(body);
    var newContactPromise = addNewContact(contact);
    newContactPromise.then(results => {response.end('Got it!')})
    .catch(results => {console.log(results)});
  });
}

let putContact = (request, response, id) => {
  console.log(id);
  let body = '';
  request.on('data', (chunk) => {
    body += chunk.toString();
  });
  request.on('end', () => {
    let newContentForContact = JSON.parse(body);
    let itemId = id[0];
    for (let key in newContentForContact) {
      let editContactPromise = updateEntry(newContentForContact, itemId, key);
      editContactPromise.then(results => {response.end('Got it!')});
    }
  });
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

let routes = [
  {
    method: 'GET',
    path: /^\/contacts\/([0-9]+)/,
    handler: getContact
  },
  {
    method: 'GET',
    path: /^\/contacts\/?$/,
    handler: getContacts
  },
  {
    method: 'POST',
    path: /^\/contacts\/?$/,
    handler: postContacts
  },
  {
    method: 'DELETE',
    path: /^\/contacts\/([0-9]+)/,
    handler: deleteContact
  },
  {
    method: 'PUT',
    path: /^\/contacts\/([0-9]+)/,
    handler: putContact
  },
  {
    method: 'GET',
    path: /^\/[0-9A-Za-z]+/,
    handler: renderFile
  }
];

let server = http.createServer((request, response) => {
  let invalid = true;
  for (let route of routes) {
    var matched = matches(request, route.method, route.path)
    if (matched) {
      route.handler(request, response, matched);
      invalid = false;
      break;
    }
  }
  // console.log(invalid);
  if (invalid) {
    response.statusCode = 404;
    response.end('404')
  }

});

server.listen(3000);
