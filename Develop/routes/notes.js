//Why the Router is necessary and what is doing?
const notes = require('express').Router();
const db = require('../db/db.json');
console.log(db);

//Why does this have a callback function?
notes.get('/', (req, res) => {
    
});

module.exports = notes;

