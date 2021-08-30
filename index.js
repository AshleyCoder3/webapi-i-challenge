// // implement your API here
// // require the express npm module, needs to be added to the project using "npm install express"
// const express = require('express');

// // creates an express application using the express module
// const server = express();

// // configures our server to execute a function for every GET request to "/"
// // the second argument passed to the .get() method is the "Route Handler Function"
// // the route handler function will run on every GET request to "/"
// server.get('/', (req, res) => {
//     // express will pass the request and response objects to this function
//     // the .send() on the response object can be used to send a response to the client
//     res.send('Hello World');
// });

// server.get('/hobbits', (req, res) => {
//     const hobbits = [
//         {
//             id: 1,
//             name: 'Samewise Gamgee'
//         },
//         {
//             id: 2,
//             name: 'Frodo Baggins'
//         }
//     ]
//     // json api instead of just .send(hobbits)
//     res.status(200).json(hobbits)
// })

// // once the server is fully configured we can have it "listen" for connections on a particular "port"
// // the callback function passed as the second argument will run once when the server starts
// server.listen(8000, () => console.log('API running on port 8000'));

const express = require('express');

const Users = require('./data/db.js');

const server = express();

server.use(express.json());

server.post('/api/users', (req, res) => {
    const { name, bio } = req.body;

    if (!name || !bio) {
        res
            .status(400)
            .json({ errorMessage: 'Please provide name and bio for the user.' });
    } else {
        Users.insert(req.body)
            .then(user => {
                res.status(201).json(user);
            })
            .catch(() => {
                res.status(500).json({
                    errorMessage:
                        'There was an error while saving the user to the database',
                });
            });
    }
});

server.get('/api/users', (req, res) => {
    Users.find()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(() => {
            res.status(500).json({
                errorMessage: 'The users information could not be retrieved.',
            });
        });
});

server.get('/api/users/:id', (req, res) => {
    Users.findById(req.params.id)
        .then(user => {
            if (user) {
                res.status(200).json(user);
            } else {
                res
                    .status(404)
                    .json({ message: 'The user with the specified ID does not exist.' });
            }
        })
        .catch(() => {
            res
                .status(500)
                .json({ errorMessage: 'The user information could not be retrieved.' });
        });
});

server.delete('/api/users/:id', (req, res) => {
    Users.remove(req.params.id)
        .then(count => {
            if (count && count > 0) {
                res.status(200).json({
                    message: 'the user was deleted.',
                });
            } else {
                res
                    .status(404)
                    .json({ message: 'The user with the specified ID does not exist.' });
            }
        })
        .catch(() => {
            res.status(500).json({ errorMessage: 'The user could not be removed' });
        });
});

server.put('/api/users/:id', (req, res) => {
    const { name, bio } = req.body;

    if (!name || !bio) {
        res
            .status(400)
            .json({ errorMessage: 'Please provide name and bio for the user.' });
    } else {
        Users.update(req.params.id, req.body)
            .then(user => {
                if (user) {
                    res.status(200).json(user);
                } else {
                    res
                        .status(404)
                        .json({
                            message: 'The user with the specified ID does not exist.',
                        });
                }
            })
            .catch(() => {
                res.status(500).json({
                    errorMessage: 'The user information could not be modified.',
                });
            });
    }
});

const port = 5000;
server.listen(port, () => console.log(`\n*** API on port ${port} ***\n`));