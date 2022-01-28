const { query } = require('express');
const express = require('express');
const router  = express.Router();
const Users   = require('../models/Users');
const Token   = require('../models/Token');
const Emails   = require('../models/Emails');
const ItemsReview = require('../models/ItemReview');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt')
const crypto = require("crypto");
const nodeoutlook = require('nodejs-nodemailer-outlook')
const multer = require('multer');
const path = require('path')
var imgPath = path.join(__dirname, '..', 'uploads')
//const upload = multer({dest: imgPath});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },

})
var upload = multer({ storage: storage })
router.use(express.static(__dirname + '/public'));
router.use('/uploads', express.static('uploads'));


router.post('/upload', upload.single('photo'), function (req, res, next) {
    // req.file is the `profile-file` file
    // req.body will hold the text fields, if there were any
    var username
    Users.findOneAndUpdate({_id: req.body.id}, {$set:{userImageURL: req.file.path}}, {new: true, useFindAndModify: false}, (err, doc) => {
        
        Users.findOne({_id: req.body.id}).exec(function(err, user) {
            username = user.username
            console.log(username)
               
            ItemsReview.updateMany({reviewerUsername: username}, {reviewerPicture: req.file.path }).exec(function(err, user) {
                res.redirect('http://localhost:8050/users/profile')
                
             })
         })

        
    });
  })


//Fetch user details
router.get('/', async (req,res) => {
    try {
        const posts = await Users.find();
        res.json(posts);
    }catch(err){
        res.json({message: err});
    }
});

//Get User info by ID
router.post('/getInfo', async (req, res) => {
    try {
        const posts = await Users.findById(req.body._id);
        res.json(posts);
    }catch(err){
        res.json({message: err});
    }
});


//SignIn
router.post('/signIn', async (req, res) => {
    var password = req.body.password
    var errors = []
    Users.findOne({username: req.body.username}).exec(function(err, user) {
        if(!user){
            res.json({errors: "true"})
        }
        else{
            bcrypt.compare(req.body.password,user.password,(err,isMatch)=>{
                if(err) throw err;
               
                if(isMatch) {
                    res.json({userId: user._id, errors: "false"})
                } 
                else{
                    res.json({errors: "true"})
                }
            })
        }

        

     })
});

//Change Password
router.post('/changePassword', async (req, res) => {
    var oPass = req.body.oPass
    var nPass = req.body.nPass

    console.log(oPass)
    Users.findOne({_id: req.body.username}).exec(function(err, user) {
        if(!user){
            
        }
        else{
            bcrypt.compare(req.body.oPass,user.password,(err,isMatch)=>{
                if(err) throw err;
               
                if(isMatch) {
                    console.log('macth')
                    bcrypt.genSalt(10, function(err, salt) {
                        bcrypt.hash(nPass, salt, function(err, hash) {
                           
                            const filter = { _id: req.body.username };
                            const update = { password: hash };

                            Users.findOneAndUpdate(filter, {$set:update}, {new: true, useFindAndModify: false}, (err, doc) => {
                                res.json('true')
                               
                            });
                            
                        });
                      });
                } 
                else{
                   
                    res.json('false')
                }
            })
        }

        

     })

});

//SignUp
router.post('/signUp', [
    check('email', 'Email is not valid').isEmail(),
    check('password', 'Password must at least have 6 characters').isLength({min: 6}).custom((value,{req, loc, path}) => {
        if (value !== req.body.cPassword) {
            throw new Error("Passwords do not match");
        } else {
            return value;
        }
    })
    ],  (req, res) => {
    var bool = true;
    console.log(req.body.emailNotif)
    var errors = validationResult(req).array();
    if(errors.length != 0){
        res.render('signup', { errors: errors, username: req.body.username, email: req.body.email, password: req.body.password, cPassword: req.body.cPassword})
    }
    else{
        Users.findOne({email: req.body.email}).exec(function(err, mail) { 
            if(mail){
                errors.push({msg: 'Email already registered'})
            }

             Users.findOne({username: req.body.username}).exec(function(err, user) { 
                if(user){
                    errors.push({msg: 'Username taken'})
                }
                
                if(errors.length == 0){
             
                    var oldPass = req.body.password

                    bcrypt.genSalt(10, function(err, salt) {
                        bcrypt.hash(oldPass, salt, function(err, hash) {
                            Users.create({ username: req.body.username, email: req.body.email, password: hash, 
                                userImageURL: 'https://i.imgur.com/OzsKvjz.jpg',
                                wishlistIDs: [],
                                lastVisited: [],
                            }, function (err, small) {
                                if (err) return handleError(err);
                              });
                        });
                      });


                      if(req.body.emailNotif == "1"){
                        Emails.findOneAndUpdate({num: "1"}, {$push:{emails: req.body.email}}, {new: true, useFindAndModify: false}, (err, doc) => {
                            
                        
                        });
                      }
                  bool = false;
                  var success = []
                  success.push({msg: "Account Successfully Created!"})
                  res.render('signin', {success: success, username: req.body.username, password: req.body.password })

                }

                if(bool == true){
                    res.render('signup', { errors: errors, username: req.body.username, email: req.body.email, password: req.body.password, cPassword: req.body.cPassword})
                }
            })


          })
         
    }
});


//Forgot Password
router.get('/forgotpassword', async (req,res) => {
    res.render('forgotpassword')
});


router.post('/forgotpassword', async (req,res) => {
    var errors = []
    var bool = 1
    const user = await Users.findOne({ username: req.body.username });
    var mail = await Users.findOne({ email: req.body.username });
    
    if(!user && !mail){
        bool = 0
        errors.push({msg: 'Invalid Username/Email'})
        res.render('forgotpassword', {errors: errors, username: req.body.username})
    }
    else if(user){
        mail = user
    }

    if(bool == 1){
        var email = mail.email
        var token = await Token.findOne({ email: email });
        if(token){
            await token.deleteOne()
        }

        var resetToken = crypto.randomBytes(32).toString("hex");
        const bcryptSalt =  await bcrypt.genSalt(10) 
        const hash = await bcrypt.hash(resetToken, Number(bcryptSalt));
        
        await new Token({
            userID: mail._id,
            email: email,
            token: hash,
            createdAt: Date.now(),
          }).save();

        const link = `http://localhost:8050/users/passwordReset?token=${resetToken}&id=${mail._id}`;

        nodeoutlook.sendEmail({
            auth: {
                user: "cmps278project@outlook.com",
                pass: "HtmlCss123"
            },
            from: 'cmps278project@outlook.com',
            to: email,
            subject: 'Password Reset',
            html: '<h3>A password reset request has been initiated, to reset your password click on the below link. IGNORE THIS MESSAGE IF YOU DID NOT INITIATE A RESET PASSWORD REQUEST</h3>' + link
        }
         
         
        );

        var success = []
        success.push({msg: 'Password reset has been initiated, please check your inbox and follow the steps'})
        res.render('forgotpassword', {success: success})

    }
});

//Reset Password
router.get('/passwordReset', async(req, res) => {
    var token = req.query.token;
    var id = req.query.id;

    const user = await Token.findOne({ userID: id });
    const hash = await bcrypt.compare(token, user.token);

    if(hash == true){
        res.render('passwordReset', {username : user.email})
    }

});


router.post('/passwordReset', [
    check('password', 'Password must at least have 6 characters').isLength({min: 6}).custom((value,{req, loc, path}) => {
        if (value !== req.body.cPassword) {
            throw new Error("Passwords do not match");
        } else {
            return value;
        }
    })
    ],  (req, res) => {
    var bool = true;
    var errors = validationResult(req).array();
    if(errors.length != 0){
        res.render('passwordReset', { errors: errors, username: req.body.username, password: req.body.password, cPassword: req.body.cPassword})
    }
    else{
        Users.findOne({email: req.body.email}).exec(function(err, mail) { 
            

             Users.findOne({username: req.body.username}).exec(function(err, user) { 
             
                
                if(errors.length == 0){
                    const pass = req.body.password
                    //const bcryptSalt =  await bcrypt.genSalt(10) 
                   // const hash = await bcrypt.hash(pass, Number(bcryptSalt));


                    bcrypt.genSalt(10, function(err, salt) {
                        bcrypt.hash(pass, salt, function(err, hash) {
                           
                            const filter = { email: req.body.username };
                            const update = { password: hash };

                            Users.findOneAndUpdate(filter, {$set:update}, {new: true, useFindAndModify: false}, (err, doc) => {
                                if (err) {
                                    console.log("Something wrong when updating data!");
                                }
                            
                            });
                            
                        });
                      });



                    

                  bool = false;
                  var success = []
                  success.push({msg: "Password Successfully Changed!"})

                  Users.findOne({email: req.body.username}).exec(function(err, user) {
                    res.render('signin', {success: success, username: user.username, password: req.body.password })
                 })

                }

                if(bool == true){
                    res.render('passwordReset', { errors: errors, username: req.body.username, password: req.body.password, cPassword: req.body.cPassword})
                }
            })


          })
         
    }
});



//Create user
router.post('/createUser', async(req,res) => {
    const post = new Users({
        username: req.body.username ,
        email: req.body.email,
        password: req.body.password,
        userImageURL: req.body.userImageURL,
        wishlistIDs: [],
        lastVisited: [],
    });
    try {
        const savedPost = await post.save();
        res.json(savedPost);
    }catch(err){
        res.json({message: err});
    }
});

//Add to wishlist
router.post('/addToWishlist', async(req,res) => {
    var username = req.body.username
    var itemId = req.body.itemId
    
    Users.updateOne({'_id':username},{$push: { 'wishlistIDs': itemId }}).exec(function(err, count) { 
    
    });
});

//Remove from wishlist
router.post('/removeFromWishlist', async(req,res) => {
    var username = req.body.username
    var itemId = req.body.itemId
    
    Users.updateOne({'_id':username},{$pull: { 'wishlistIDs': itemId }}).exec(function(err, count) { 
    
    });
});


router.post('/checkWishlist', async(req,res) => {
    var username = req.body.username
    var itemId = req.body.itemId
    
    Users.countDocuments({'_id':username, 'wishlistIDs': itemId}).exec(function(err, count) { 
      if(count>0){
          res.send(true)
      }
      else{
          res.send(false)
      }
    });

   
});


router.get('/profile', async(req,res)=>{
    res.render('profile')
})


router.post('/profile', async(req,res)=>{
    var id = req.body.userID

    Users.find({'_id':id}).exec(function(err, post) { 
        res.json(post)
      });
})


router.post('/getWishlist', async(req,res) => {
    var username = req.body.username
    
    Users.find({'_id':username}).select('wishlistIDs -_id').exec(function(err, post) { 
      res.json(post)
    });

   
});


router.post('/getLastVisited', async(req,res) => {
    var username = req.body.username
    
    Users.find({'_id':username}).select('lastVisited -_id').exec(function(err, post) { 
      res.json(post)
    });

   
});


router.post('/addToLastVisited', async(req,res) => {
    var username = req.body.username
    var itemId = req.body.itemId
    
    Users.updateOne({'_id':username},{$pull: { 'lastVisited': itemId }}).exec(function(err, count) { 
  
        Users.updateOne({'_id':username}, {$push: { 'lastVisited': itemId }}, {upsert: true}, function(err){

            Users.find({'_id':username}).select('lastVisited -_id').exec(function(err, post) { 

                if(post[0].lastVisited.length == 25){
                    Users.updateOne( { _id: username }, { $pop: { lastVisited: -1 } } ).exec(function(err, count) { 
            
                    });
                }
                
              });
        })

    });

    
   

});


module.exports = router;