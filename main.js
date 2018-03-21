var fs = require('fs');
var readline = require('readline');
var promisify = require('util').promisify

var readFile = promisify(fs.readFile);
var writeFile = promisify(fs.writeFile);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var phonebook = [
  {
    name: 'Robby',
    number: '7062027841',
    email: 'rcackerley@me.com'
  }
];
readFile('data.txt')
  .then(function (data){
  phonebook = JSON.parse(data);
  })
// fs.readFile('data.txt', (err, data) => {
//   if (err) throw err;
//   phonebook = JSON.parse(data);
// });

var promptMenu = function() {
  console.log(
    ' 1. Look up an entry, 2. Set an entry, 3. Delete an entry, 4. List all entries, 5. Quit')
};

var phonebookApp = function() {
  promptMenu();
  rl.question('What do you want to do (1-5)? ', (answer) => {
    if (answer === '1') {
      rl.question('Who do you want to Lookup? ', (answer) => {
        phonebook.forEach(function(entry) {
          if (answer === entry.name) {
            console.log(entry);
            phonebookApp()
          } else {
            console.log('That entry does not exist.');
            phonebookApp()
          }
        })
      });
    } else if (answer === '2') {
      rl.question('What is the name? ', (answer) => {
        rl.question('What is their number? ', (answer2) => {
          rl.question('What is their email? ', (answer3) => {
            var entry = {
              name: answer,
              number: answer2,
              email: answer3,
            }
            phonebook.push(entry);
            console.log(entry);
            phonebookApp()
          })
        })
      })
    } else if (answer === '3') {
        rl.question('Who do you want to delete? ', (answer) => {
          for (i = 0; i < phonebook.length; i++) {
            if (phonebook[i].name === answer) {
              phonebook.splice(i, 1)
              phonebookApp();
            } else {
              console.log('That entry does not exist.')
              phonebookApp();
            }
          }
        })
    } else if (answer === '4') {
      console.log(phonebook);
      phonebookApp();
    } else if (answer === '5') {
      var JSONdata = JSON.stringify(phonebook);
      writeFile('data.txt', JSONdata)
        .then(function() {
          console.log('The file has been saved!');
        })
      // fs.writeFile('data.txt', JSONdata, (err) => {
      //   if (err) throw err;
      //   console.log('The file has been saved!');
      // });
        console.log('Goodbye')
        rl.close();
    } else {
      console.log('That was a not a valid response.')
      phonebookApp();
    }
  });

}

phonebookApp()
