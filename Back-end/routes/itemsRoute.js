const express = require('express');
const router = express.Router();
const Items = require('../models/Items');


router.get('/root', async (req,res) => {
    res.send("You're on items");
});

//Get all of one type
router.get('/getType/:itemType', async(req, res) => {
    try{
        const query = {itemType: req.params.itemType};
        const posts  = await Items.find(query);
        res.json(posts);
    }catch(err){
        res.json({message:err});
    }
});


//Go to item page
router.get('/itemDetail', async(req, res) => {
    res.render('itemDetail');
});

//Get specific item
router.get('/find/:postId', async(req, res) => {
    try{
        const posts = await Items.findById(req.params.postId);
        res.json(posts);
    }catch(err){
        res.json({message: err});
    }
});

//Create New Item
router.post('/createItem', async (req,res,next) => {
    console.log(req.body);
    const post = new Items({
        itemName: req.body.itemName,
        itemDesc: req.body.itemDesc,
        itemType: req.body.itemType,
        itemImageURL: req.body.itemImageURL,
        averageRating: req.body.averageRating,
        totalNumReviews: req.body.totalNumReviews,
        itemGenre: req.body.itemGenre,
        itemPrice: req.body.itemPrice,
        movieTrailerURL: req.body.movieTrailerURL,
        movieCast: req.body.movieCast,
        movieCredit: req.body.movieCredit,
        extraImages: req.body.extraImages,
        releaseDate: Date.parse(req.body.releaseDate)
    });

    try {
        const savedPost = await post.save();
        res.json(savedPost);
    }catch(err){
        res.json({message: err});
    }

});


module.exports = router;