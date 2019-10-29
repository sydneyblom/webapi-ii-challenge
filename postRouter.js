//adding in express
const express = require("express");

const postRouter = express.Router();

const post = require("./data/db.js");

//all posts
//GET	/api/posts
postRouter.get("/", (req, res) => {
  post
    .find()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

//get by id
//GET	/api/posts/:id
postRouter.get("/:id", (req, res) => {
  const postId = req.params.id;

  post
    .findById(postId)
    .then(posts => {
      //if posts and posts.length are true
      if (posts && posts.length) {
        console.log(post);
        res.status(200).json(posts);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist" });
      }
    })
    .catch(error => {
      res
        .status(500)
        .json({ message: "The post information could not be retrieved." });
    });
});

//comments by id
//GET	/api/posts/:id/comments
postRouter.get("/:id/comments", (req, res) => {
  const postId = req.params.id;
  post
    .findPostComments(postId)
    .then(post => {
      if (post && post.length) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The comments information could not be retrieved." });
    });
});


//POST	/api/posts
postRouter.post("/", (req, res) => {
  const postInfo = req.body;

  if (!postInfo.title || !postInfo.contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  } else {
    post
      .insert(postInfo)
      .then(postIdObject => {
        post
          .findById(postIdObject.id)
          .then(posts => {
            console.log("insert post", posts);
            res.status(201).json(posts);
          })
          .catch(error => {
            res.status(404).json({
              error: "The post with the specified id does not exist."
            });
          });
      })
      .catch(error => {
        res.status(500).json({
          error: "There was an error while saving the post to the database"
        });
      });
  }
});


//POST	/api/posts/:id/comments
postRouter.post("/:id/comments", (req, res) => {
  const postId = req.params.id;
  const comment = req.body;
  comment.post_id = postId;

  post
    .findById(postId)
    .then(posts => {
      if (posts && posts.length) {
        if (!comment.text) {
          res
            .status(400)
            .json({ errorMessage: "Please provide text for the comment." });
        } else {
          post
            .insertComment(comment)
            .then(commentObject => res.status(201).json(commentObject))
            .catch(error =>
              res.status(500).json({
                error:
                  "There was an error while saving the comment to the database"
              })
            );
        }
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: "The post information could not be retrieved."
      });
    });
});

//PUT	/api/posts/:id
postRouter.put("/:id", (req, res) => {
    const postsId = req.params.id;
    const posts = req.body;
  
    if (!posts.title || !posts.contents) {
      res.status(400).json({
        errorMessage: "Please provide title and contents for the post."
      });
      return;
    }
  
    post.update(postsId, posts)
      .then(updatedPost => {
        if (updatedPost) {
          res.status(200).json({ posts });
        } else {
          res
            .status(404)
            .json({ message: "The post with the specified ID does not exist." });
        }
      })
      .catch(err =>
        res
          .status(500)
          .json({ error: "The post information could not be modified." })
      );
  });

  postRouter.delete('/:id', (req, res) => {
    const postId = req.params.id;
    post.remove(postId)
    .then (posts => {
        if(posts && posts.length){
            res.status(404).json( {message: 'The post with the specified ID does not exist.'})
           
        }
        else {
            res.status(204).json( {message: 'The post was successfully deleted.'} );
            
        }
    })
    .catch (error => {
        console.log("delete error", error);
        res.status(500).json( {error: 'The post could not be removed.'} );
    })

});
module.exports = postRouter;
