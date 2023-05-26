const express = require('express');
const path = require('path');
const api = require('./routes/index');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', api);

//What does this do? like what is the difference with the code above.
app.use(express.static('public'));

//Why does this does not have a callback function like the other one in notes?
app.get('/', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/index.html'))  
);

app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.listen(PORT, () => 
    console.log(`App listening at http://localhost:${PORT} 🚀 `)
);


