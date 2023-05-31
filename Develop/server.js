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
            note_id: uuid(),
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

app.get('/api/notes/:note_id', (req, res) => {
    if(req.params.note_id) {
        console.info(`${req.method} request received to get a single note`);
        const noteId = req.params.note_id;

        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if(err) {
                console.error(err);
            } else {
                const parsedData = JSON.parse(data);
                const foundNote = parsedData.find(note => note.note_id === noteId);

                if(foundNote) {
                    console.log(foundNote);
                    res.status(200).json(foundNote);
                } else {
                    console.log('Note not found');
                }
            }
        })

    } else {
        res.status(400).json('Insert a valid note id');
    }
});

app.delete('/api/notes/:note_id', (req, res) => {

    if(req.params.note_id) {
        console.info(`${req.method} received to delete a note`);
        const noteId = req.params.note_id;

        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            
            if(err) {
                console.error(err);
            } else {
                let parsedData = JSON.parse(data);
                const filteredData = parsedData.filter(note => note.note_id !== noteId);

                if(filteredData.length !== parsedData.length) {
                    fs.writeFile('./db/db.json', JSON.stringify(filteredData), 'utf8', (err) => {
                        if(err) {
                            console.error(err);
                        } else {
                            console.info('Note deleted succesfully')
                        }
                    });
                }

            }
        })


    } else {
        console.log('Insert a valid note id');
    }
    
});

app.listen(PORT, () => 
    console.info(`Server listening at http://localhost:${PORT}`)
);