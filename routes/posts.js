const express = require('express')
const router = express.Router()
const Post = require('../models/post')


router.get('/', async(req,res) => {
    try{
           const posts = await Post.find()
           res.json(posts)
    }catch(err){
        res.send('Error ' + err)
    }
})

router.post('/', async(req,res) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
    })

    try{
        const a1 =  await post.save()
        res.json(a1)
    }catch(err){
        res.send('Error')
    }
})

router.get('/:id', async(req,res) => {
    try{
           const post = await Post.findById(req.params.id)
           res.json(post)
    }catch(err){
        res.send('Error ' + err)
    }
})




router.patch('/:id',async(req,res)=> {
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


router.delete('/:id',async(req,res)=> {
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

module.exports = router