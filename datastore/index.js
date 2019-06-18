const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  // var id = counter.getNextUniqueId(callback);
  counter.getNextUniqueId( (str) => {
    var id = str;
    console.log('id: ' + str);
    items[id] = text;

    fs.writeFile( `./datastore/data/${id}.txt`, text, (err) => {
      if (err) {
        return console.log('error writing new file: ', err);
      }
      console.log(`File ${id}: '${text}' saved!`);
    });
  });
  callback(null, { id: id, text: text });
};

exports.readAll = (callback) => {

  let data = [];

  fs.readdir('./datastore/data', ( err, todos ) => {

    if (err) {
      console.log(`readAll error: ${err}`);
    } 
    todos.forEach( (todo) => {
      data.push({id:todo, text: todo});
    });
    callback(null, data);
  });

  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);
};

exports.readOne = (id, callback) => {

  fs.readFile(`./datastore/data/${id}`, (err, todo) => {
    if (err) {
      console.log('error at readOne: ', err);
    }
    console.log('todo readOne ', String(todo));
    callback(null, {text: String(todo)});
  });
};

//   var text = items[id];
//   if (!text) {
//     callback(new Error(`No item with id: ${id}`));
//   } else {
//     callback(null, { id, text });
//   }
// };

exports.update = (id, text, callback) => {
  
  fs.writeFile(`./datastore/data/${id}`, text, (err) => {

    if (err) {
      console.log('Error updating: ', err);
    }
    console.log('Updated text: ', text);
    callback(null, {id, text});
  });

};

exports.delete = (id, callback) => {

  fs.unlink(`./datastore/data/${id}`, (err) => {
    if (err) {
      console.log('deletion error: ', err);
    }
    callback(null);
  });

  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
