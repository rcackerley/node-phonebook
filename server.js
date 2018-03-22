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
  return request.method === method &&
         path.test(request.url);
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

let getContact = (request, response) => {
  let url = request.url.toString();
  let itemId = url.slice(10);
  let requestedEntry = getRequestedEntry(itemId, request)
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

let putContact = (request, response) => {
  let body = '';
  request.on('data', (chunk) => {
    body += chunk.toString();
  });
  request.on('end', () => {
    let newContentForContact = JSON.parse(body);
    let url = request.url.toString();
    let itemId = url.slice(10);
    let requestedEntry = getRequestedEntry(itemId, request);
    updateEntry(newContentForContact, requestedEntry);
  })
  response.end('Got it!');
}
// console.log(putContact)
let routes = [
  {
    method: 'GET',
    path: /^\/contacts\/[0-9]+/,
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
    path: /^\/contacts\/[0-9]+/,
    handler: deleteContact
  },
  {
    method: 'PUT',
    path: /^\/contacts\/[0-9]+/,
    handler: putContact
  }
];

let server = http.createServer((request, response) => {

  let route = routes.find((route) => {
    return matches(request, route.method, route.path)
  });
  route.handler(request, response);

});

server.listen(3000);
