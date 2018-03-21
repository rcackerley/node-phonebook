var http = require('http');

var phonebook = [{
  "name": "robby",
  "number": "7062027841",
  "email": "rcackerley@me.com",
  "id": 0
}];

var lastID = 0;

var getRequestedEntry = function(itemId, request) {
  return phonebook.find(function(element){
    return element.id.toString() === itemId;
  })
}

var updateEntry = function(newContentForContact, requestedEntry) {
  for (var key in requestedEntry) {
    for (var receivedKey in newContentForContact) {
      if (key === receivedKey) {

        requestedEntry.key = newContentForContact.receivedKey;
        console.log(requestedEntry.key)
      }
    }
  }
}
var matches = function(request, method, path) {
  return request.method === method &&
         request.url.startsWith(path);
}
var addNewContact = function(contact) {
  contact.id = ++lastID;
  phonebook.push(contact);
}

var deleteContact = function(request, response) {
  var requestedEntry = getRequestedEntry(itemId, request);
  var index = phonebook.indexOf(contact);
  phonebook.splice(index, 1);
  response.end('item deleted');
}

var getContact = function(request, response) {
  var url = request.url.toString();
  var itemId = url.slice(10);
  var requestedEntry = getRequestedEntry(itemId, request)
  response.end(JSON.stringify(requestedEntry));
}

var getContacts = function(request, response) {
  response.end(JSON.stringify(phonebook));
}

var postContacts = function(request, response) {
  var body = '';
  request.on('data', function(chunk) {
    body += chunk.toString();
  });
  request.on('end', function() {
    var contact = JSON.parse(body);
    addNewContact(contact);
    response.end('Got it!')
  });
}

var putContact = function(request, response) {
console.log('here')
  var body = '';
  request.on('data', function(chunk){
    body += chunk.toString();
  });
  request.on('end', function() {
    var newContentForContact = JSON.parse(body);
    var url = request.url.toString();
    var itemId = url.slice(10);
    var requestedEntry = getRequestedEntry(itemId, request);
    updateEntry(newContentForContact, requestedEntry);
  })
  response.end('Got it!');
}

var routes = [
  {
    method: 'GET',
    path: '/contacts/',
    handler: getContact
  },
  {
    method: 'GET',
    path: '/contacts',
    handler: getContacts
  },
  {
    method: 'POST',
    path: '/contacts',
    handler: postContacts
  },
  {
    method: 'DELETE',
    path: '/contacts/',
    handler: deleteContact
  },
  {
    method: 'PUT',
    path: '/contacts/',
    handler: putContact
  }
];


var server = http.createServer(function(request, response) {

  var route = routes.find(function(route) {
    return matches(request, route.method, route.path)
  });
  route.handler(request, response);

});

server.listen(3000);
