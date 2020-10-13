const express = require("express");
const router = express.Router();
const axios = require("axios");
const jwt = require("jsonwebtoken");
var utils = require("utils");
const jwt_decode = require("jwt-decode");
const Post = require("../models/post");

router.get("/:token", async (req, res) => {
  axios
    .get("http://localhost:3000/auth/isAuthenticated", {
      headers: {
        "x-auth-token": req.params.token,
      },
    })
    .then(async function (response) {
      // User is authenticated

      try {
        const posts = await Post.find();
        res.json(posts);
      } catch (err) {
        res.send("Error " + err);
      }
    })
    .catch(function (error) {
      // User is not authenticated
      res.status(401).send("Error occurred !");
    });
});

router.post("/:token", async (req, res) => {
  axios
    .get("http://localhost:3000/auth/isAuthenticated", {
      headers: {
        "x-auth-token": req.params.token,
      },
    })
    .then(async function (response) {
      // User is authenticated
      console.log("haha");
      console.log(req.params.token);
      var decoded = jwt_decode(req.params.token);
      console.log(decoded);
      const post = new Post({
        title: req.body.title,
        content: req.body.content,
        rate: 0,
        author: decoded.username,
      });

      try {
        const a1 = await post.save();
        res.json(a1);
      } catch (err) {
        res.send("Error");
      }
    })
    .catch(function (error) {
      // User is not authenticated
      res.status(401).send("Error occurred !");
    });
});

// Get my posts
router.get("/myposts/:token",async (req,res)=>{
	axios.get('http://localhost:3000/auth/isAuthenticated', {
		headers: {
			'x-auth-token': req.params.token
		}})
  		.then(async function (response) {
			// User is authenticated
    try{
           var decoded = jwt_decode(req.params.token);
          const post = await Post.find({ author: decoded.username }).exec();
        //   const post = await Post.findById(req.params.id)
           res.json(post)
    }catch(err){
        res.send('Error ' + err)
    }

})
.catch(function (error) {
    // User is not authenticated
    res.status(401).send('Error occurred !');
  })
  })
// Get post by id : public
router.get('/:id', async(req,res) => {
  try{
         const post = await Post.findById(req.params.id)
         res.json(post)
  }catch(err){
      res.send('Error ' + err)
  }
})



  router.patch('/:id/:token',async (req,res)=>{
	axios.get('http://localhost:3000/auth/isAuthenticated', {
		headers: {
			'x-auth-token': req.params.token
		}})
  		.then(async function (response) {
			// User is authenticated

    try{
        const post = await Post.findById(req.params.id)
        post.title = req.body.title
        post.content = req.body.content
        const a1 = await post.save()
        res.json(a1)
    }catch(err){
        res.send('Error')
    }
})
.catch(function (error) {
    // User is not authenticated
    res.status(401).send('Error occurred !');
  })
  })


  router.delete('/:id/:token',async (req,res)=>{
	axios.get('http://localhost:3000/auth/isAuthenticated', {
		headers: {
			'x-auth-token': req.params.token
		}})
  		.then(async function (response) {
			// User is authenticated
    const id = req.params.id;

    Post.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete Post with id=${id}. Maybe Post was not found!`
          });
        } else {
          res.send({
            message: "Post was deleted successfully!"
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Post with id=" + id
        });
      });
  })
  .catch(function (error) {
    // User is not authenticated
    res.status(401).send('Error occurred !');
  })
  })


module.exports = router