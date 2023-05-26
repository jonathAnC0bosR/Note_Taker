const express = require('express');
const fs = require('fs');
const PORT = 3001;
const path = require('path');
const dbJson = require('./db/db.json');
const uuid = require('./helpers/id_gen');


const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => 
    res.sendFile(path.join(__dirname, './public/index.html'))
);

app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, './public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    res.json(dbJson);
});

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a note`);

    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title, 
            text,
            review_id: uuid(),
        }

        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if(err) {
                console.log(err);
            } else {
                
                const parsedNote = JSON.parse(data);
                parsedNote.push(newNote);

                fs.writeFile('./db/db.json', JSON.stringify(parsedNote, null, 4), (writeErr) =>
                    writeErr ? console.error(writeErr) : console.info('Succesfully added note!')
                );
            };
        })

        const response = {
            status: 'succes',
            body: newNote,
        };

        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Error posting new note');
    }

    
});

app.listen(PORT, () => 
    console.info(`Server listening at http://localhost:${PORT}`)
);