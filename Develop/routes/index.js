const express = require('express');

const notesRouter = require('./notes');

const app = express();

//What does this code doing?
app.use('/notes', notesRouter);

module.exports = app;