const express = require('express');
const router = express.Router();
const MoviesReview = require('../models/MovieReview');

router.get('/', async (req,res) => {
    res.send("On Movies Review");
});

//Get movie reviews
router.get('/:postId', async(req, res) => {
    try{
        const query = { itemName: req.params.postId};
        const posts = await MoviesReview.find(query);
        res.json(posts);
    }catch(err){
        res.json({message: err});
    }
});

router.post('/createReview', async (req,res) => {
    const post = new MoviesReview({
        itemName: req.body.itemName,
        reviewerUsername: req.body.reviewerUsername,
        
        reviewText: req.body.reviewText,
        numberOfLikes: req.body.numberOfLikes
    });

    try {
        const savedPost = await post.save();
        res.json(savedPost);
    }catch(err){
        res.json({message: err});
    }
});


module.exports = router;