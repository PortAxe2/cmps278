const express = require('express');
const router = express.Router();
const Items = require('../models/Items');

router.use(express.static(__dirname + '/public'));
router.use('/uploads', express.static('uploads'));

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

//Show wishlist
router.post('/showWishlist', async(req,res) => {
    var wishlist = req.body.wishlist

    Items.find({'_id':wishlist}).exec(function(err, post) { 
        res.json(post)
      })

});

//Get Similar Items
router.post('/similar', async(req,res) => {
    var genre = req.body.genre
    var iType = req.body.itemType

    Items.find({itemType : iType,  itemGenre: { "$in" : genre}}).exec(function(err, post) { 
        if(post){
            res.json(post)

        }
        else{
            res.json(null)
        }
      })
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
    //console.log(req.body);
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


router.post('/searchBar', async(req,res) => {
    var type = req.body.itemType
    var query = req.body.description

    var results = []

    if(type != "all"){
        Items.find(
            {itemType: type ,"itemName": { "$regex": query, "$options": "i" } },
            function(err,docs) { 
               if(err){
                   console.log(err)
               }

                if(docs){
                    results.push(docs)

                    Items.find(
                        {itemType: type ,"itemDesc": { "$regex": query, "$options": "i" } },
                        function(err,docs) { 
                            results.push(docs)
                            var x = results[0].concat(results[1]);
                          
                            var array = []
                            var bool = 1
                            for(var i=0;i<x.length;i++){
                                bool = 1
                                for(var j=0; j<array.length;j++){
                                    if(x[i].itemName == array[j].itemName){
                                        bool = 0
                                    }
                                }

                                if(bool == 1){
                                    array.push(x[i])
                                }
                            }
                            
                            res.render('search', {items: array})
                        } 
                    )
                }
                else{
                    Items.find(
                        {itemType: type ,"itemDesc": { "$regex": query, "$options": "i" } },
                        function(err,docs) { 
                            results.push(docs)
                           
                        
                            
                            res.render('search', {items: results})
                        } 
                    )
                }
            
    
                
            } 
        )
    }
    else{
        Items.find(
            {"itemName": { "$regex": query, "$options": "i" } },
            function(err,docs) { 
                
    
                if(docs){
                    results.push(docs)
                    Items.find(
                        {"itemDesc": { "$regex": query, "$options": "i" } },
                        function(err,docs) { 
                            results.push(docs)
                            var x = results[0].concat(results[1]);
                            
                            var array = []
                            var bool = 1
                            for(var i=0;i<x.length;i++){
                                bool = 1
                                for(var j=0; j<array.length;j++){
                                    if(x[i].itemName == array[j].itemName){
                                        bool = 0
                                    }
                                }

                                if(bool == 1){
                                    array.push(x[i])
                                }
                            }

                            res.render('search', {items: array})
                        } 
                    )
                }
                else{
                    Items.find(
                        {itemType: type ,"itemDesc": { "$regex": query, "$options": "i" } },
                        function(err,docs) { 
                            results.push(docs)
                           
                        
                            
                            res.render('search', {items: results})
                        } 
                    )
                }
               
    
                
            } 
        )
    }
   
  
});




module.exports = router;