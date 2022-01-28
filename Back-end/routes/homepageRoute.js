const express = require('express');
const router = express.Router();
router.get('/', async (req,res) => {
    res.render('homepage');
})

router.use(express.static(__dirname + '/public'));
router.use('/uploads', express.static('uploads'));
module.exports = router;