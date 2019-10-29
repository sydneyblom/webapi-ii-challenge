//adding in express
const express = require('express');

const postRouter = express.Router();


const post = require('./data/db.js');

//all posts
postRouter.get('/', (req, res) => {
    post.find()
    .then(post => {
        res.status(200).json(post)
    })
    .catch(err => {
        res.status(500).json({ error: "The posts information could not be retrieved." })
    })
});

postRouter.get('/:id', (req, res) => {

    const postId = req.params.id;

    post.findById(postId)
    .then(post => {
        if(post && post.length){
            res.status(200).json(post);
        }
        else {
            res.status(404).json( {message: 'The post with the specified ID does not exist'} );
        }
    })
    .catch(error => {
        res.status(500).json( {message: 'The post information could not be retrieved.'} );
    })
});

module.exports = postRouter;
