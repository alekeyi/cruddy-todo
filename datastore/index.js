const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
var Promise = require('bluebird');

var readFilePromise = Promise.promisify(fs.readFile);

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  // var id = counter.getNextUniqueId(callback);
  counter.getNextUniqueId( (str) => {
    var id = str;
    // console.log('id: ' + str);
    items[id] = text;

    fs.writeFile( `./datastore/data/${id}.txt`, text, (err) => {
      if (err) {
        return console.log('error writing new file: ', err);
      }else{
        callback(null, { id: id, text: text });
        console.log(`File ${id}: '${text}' saved!`);
      }
    });
  });
};

exports.readAll = (callback) => {

  // let data = [];
  const readOneAsync = Promise.promisify(exports.readOne);

  fs.readdir('./datastore/data', ( err, files ) => {
    if (err) {
      console.log(`readAll error: ${err}`);
    } else { 
      // console.log(files);
      // ids.forEach( (id) => {
      var data = _.map(files, (file) => {
        var id = path.basename(file, '.txt');
        var filepath = path.join(exports.dataDir, file);
        
        // console.log("id: ", id);
        return readFilePromise(filepath).then((text) => {
          return ({id: id, text: String(text)});
        });/*.catch((err) => {
          console.log("Error Read All", err);
        });*/
      });
      Promise.all(data).then((todoObjects) => {
        callback(null, todoObjects);
      });
    }
  });

  
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);
};

exports.readOne = (id, callback) => {

  fs.readFile(`./datastore/data/${id}.txt`, (err, todo) => {
    if (err) {
      console.log('error at readOne: ', err);
    }
    // console.log('todo readOne ', String(todo));
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
  
  fs.writeFile(`./datastore/data/${id}.txt`, text, (err) => {

    if (err) {
      console.log('Error updating: ', err);
    }
    console.log('Updated text: ', text);
    callback(null, {id, text});
  });

};

exports.delete = (id, callback) => {

  fs.unlink(`./datastore/data/${id}.txt`, (err) => {
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
