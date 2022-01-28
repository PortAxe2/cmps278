const express = require('express');
const router = express.Router();
const url = require('url');
const ItemsReview = require('../models/ItemReview');
const MongoClient = require('mongodb').MongoClient;
const connectionString = "mongodb+srv://dbBadih:BGCOG@cmps-project.zf4qh.mongodb.net/cmps278?retryWrites=true&w=majority";
const objectId = require('mongodb').ObjectID;


router.use(express.static(__dirname + '/public'));
router.use('/uploads', express.static('uploads'));


router.get('/root', async (req,res) => {
    res.send("On Items Review");
});

//Get Last 5 review reviews
router.get('/:reviews/:postId', async(req, res) => {
  const reviews = req.params.reviews
  const query = {itemID: req.params.postId};

  if(reviews == 'five'){
    ItemsReview.find(query).sort({_id: -1}).limit(5).exec(function(err, post) { 
      res.json(post);
      console.log(err)
    });
  }  
  else{
    ItemsReview.find(query).sort({_id: -1}).exec(function(err, post) { 
      res.json(post);
      console.log(err)
    });
  }
});

router.get('/:report/id/:id', async(req, res) => {
  const reportId = req.params.id

  res.render('report', {reportID: reportId})
  
 
});


router.post('/report', async(req, res) => {
  var text = req.body.details
  var id = req.body.id

  ItemsReview.findOneAndUpdate({_id:id}, {$push:{reports:text}}, {new: true, useFindAndModify: false}, (err, doc) => {
      res.send("Report Submitted")
    });
  
 
});






MongoClient.connect(connectionString, { useUnifiedTopology: true })
    .then(client => {

        const db = client.db('ItemsCollection')
        const review = db.collection('itemsreviews')

        router.post('/createReview', async (req,res) => {

        console.log("Create review reached");
        console.log(req.body.username);
        
        review.insertOne({
            itemID: req.body.itemID,
            reviewerUsername: req.body.username,
            reviewerPicture: req.body.picture,
            reviewText: req.body.commentSubmit,
            numberOfLikes: 0,
            numberOfDisLikes: 0,
            replies: [],
            likedby: [],
            dislikedby: [],
            reports: []
        })
        .then(result => {
            var url = "http://localhost:8050/items/itemDetail?reviews=five&itemID=" + req.body.itemID
          res.redirect(url)
        })
        .catch(error => console.error(error))


    })  

    router.post('/addLikes', async (req,res)=>{
        var user = req.body.username
        var bool = req.body.bool
        var id = objectId(req.body.commentId)

        review.findOneAndUpdate(
            { "_id" : id },
            { $inc: { "numberOfLikes" : 1 } , "$push": { "likedby": user } },
            {
              upsert: true
            }
          )
            .then(result => console.log("Record updated successfully"))
            .catch(error => console.error(error))
            if(bool==true){
                review.findOneAndUpdate(
                    { "_id" : id },
                    { $inc: { "numberOfDisLikes" : -1 } , "$pull": { "dislikedby": user } },
                    {
                      upsert: true
                    }
                  )
                    .then(result => console.log("Record updated successfully"))
                    .catch(error => console.error(error))
            }
         


    })

    router.post('/addDisLikes', async (req,res)=>{
        var user = req.body.username
        var id = objectId(req.body.commentId)
        var bool = req.body.bool

        review.findOneAndUpdate(
            { "_id" : id },
            { $inc: { "numberOfDisLikes" : 1 } , "$push": { "dislikedby": user } },
            {
              upsert: true
            }
          )
            .then(result => console.log("Record updated successfully"))
            .catch(error => console.error(error))

            if(bool==true){
            review.findOneAndUpdate(
                { "_id" : id },
                { $inc: { "numberOfLikes" : -1 } , "$pull": { "likedby": user } },
                {
                  upsert: true
                }
              )
                .then(result => console.log("Record updated successfully"))
                .catch(error => console.error(error))
            }
    })



    router.post('/removeLikes', async (req,res)=>{
        var user = req.body.username
        var id = objectId(req.body.commentId)

        review.findOneAndUpdate(
            { "_id" : id },
            { $inc: { "numberOfLikes" : -1 } , "$pull": { "likedby": user } },
            {
              upsert: true
            }
          )
            .then(result => console.log("Record updated successfully"))
            .catch(error => console.error(error))

    })


    router.post('/removeDisLikes', async (req,res)=>{
        var user = req.body.username
        var id = objectId(req.body.commentId)

        review.findOneAndUpdate(
            { "_id" : id },
            { $inc: { "numberOfDisLikes" : -1 } , "$pull": { "dislikedby": user } },
            {
              upsert: true
            }
          )
            .then(result => console.log("Record updated successfully"))
            .catch(error => console.error(error))

    })


})
.catch(error => console.error(error))


module.exports = router;