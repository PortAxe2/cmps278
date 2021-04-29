const express    = require('express');
const bodyParser = require('body-parser');
const mongoose   = require('mongoose');
const cors       = require('cors');
const ItemsReviews  = require('./routes/itemsReviewRoute');
const Items = require('./routes/itemsRoute');
const Users = require('./routes/usersRoute');
const Homepage = require('./routes/homepageRoute');
require('dotenv/config');


const app = express();
app.use(cors());
app.set('views', __dirname + '/views/html');
app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req,res) => {
    res.redirect('/signin');
});

app.get('/signin', (req,res) => {
    res.render('signin');
});

app.get('/homepage/movies', (req,res) => {
    res.render('movies');
});

app.use('/items', Items);
app.use('/itemsReview', ItemsReviews);
app.use('/users', Users);
app.use('/homepage', Homepage);

mongoose.connect(
    process.env.DB_CONNECTION,
    {useNewUrlParser: true},
    () => console.log('Connected')
);

app.listen(8050);

