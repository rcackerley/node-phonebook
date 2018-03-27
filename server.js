let http = require('http');
let fs = require('fs');

let contacts = [{
  "name": "robby",
  // "number": "7062027841",
  "email": "rcackerley@me.com",
  "id": 0
}];

let lastID = 0;

let getRequestedEntry = (itemId, request) => {
  return contacts.find((element) => {
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
  let matchArray = null;
  if (match != null) {
    matchArray = match.slice(1);
  }
  return request.method === method && matchArray;
}
let addNewContact = (contact) => {
  contact.id = ++lastID;
  contacts.push(contact);
}

let deleteContact = (request, response) => {
  let requestedEntry = getRequestedEntry(itemId, request);
  let index = contacts.indexOf(contact);
  contacts.splice(index, 1);
  response.end('item deleted');
}

let getContact = (request, response, id) => {
  let itemId = id[0];
  let requestedEntry = getRequestedEntry(itemId, request);
  response.end(JSON.stringify(requestedEntry));
}

let getContacts = (request, response) => {
  response.end(JSON.stringify(contacts));
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
let renderFile = (request, response) => {
  var fileName = request.url.slice(1);
  // console.log(fileName);
  fs.readFile(fileName, 'utf-8', (err, data) => {
    if (err) {
        data = err;
    }
    // console.log(data);
    // response.setHeader('Content-Type', 'text/html');
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
  console.log(invalid);
  if (invalid) {
    response.statusCode = 404;
    response.end('404')
  }

});

server.listen(3000);
