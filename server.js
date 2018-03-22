let http = require('http');

let phonebook = [{
  "name": "robby",
  "number": "7062027841",
  "email": "rcackerley@me.com",
  "id": 0
}];

let lastID = 0;

let getRequestedEntry = (itemId, request) => {
  return phonebook.find((element) => {
    return element.id.toString() === itemId;
  })
}

let updateEntry = (newContentForContact, requestedEntry) => {
  for (let key in requestedEntry) {
    for (let receivedKey in newContentForContact) {
      if (key === receivedKey) {
        requestedEntry[key] = newContentForContact[receivedKey];
      }
    }
  }
}
let matches = (request, method, path) => {
  var match = path.exec(request.url);
  let matchArray = [];
  if (match != null) {
    matchArray = match.slice(1);
  }
  return request.method === method && matchArray;
}
let addNewContact = (contact) => {
  contact.id = ++lastID;
  phonebook.push(contact);
}

let deleteContact = (request, response) => {
  let requestedEntry = getRequestedEntry(itemId, request);
  let index = phonebook.indexOf(contact);
  phonebook.splice(index, 1);
  response.end('item deleted');
}

let getContact = (request, response, id) => {
  let itemId = id[0];
  let requestedEntry = getRequestedEntry(itemId, request);
  response.end(JSON.stringify(requestedEntry));
}

let getContacts = (request, response) => {
  response.end(JSON.stringify(phonebook));
}

let postContacts = (request, response) => {
  let body = '';
  request.on('data', (chunk) => {
    body += chunk.toString();
  });
  request.on('end', () => {
    let contact = JSON.parse(body);
    addNewContact(contact);
    response.end('Got it!')
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
    let requestedEntry = getRequestedEntry(itemId, request);
    updateEntry(newContentForContact, requestedEntry);
  })
  response.end('Got it!');
}
// console.log(putContact)
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
  }
];

let server = http.createServer((request, response) => {
  for (let route of routes) {
    var matched = matches(request, route.method, route.path)
    if (matched) {
      route.handler(request, response, matched);
    }
  }
  // let route = routes.find((route) => {
  //   return matches(request, route.method, route.path)
  // });
  // route.handler(request, response, request.url);

});

server.listen(3000);
