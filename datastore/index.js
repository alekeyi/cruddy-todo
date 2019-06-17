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
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
