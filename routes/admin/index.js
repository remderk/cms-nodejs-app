const express = require('express');
const router = express.Router();
const faker = require('faker');
const Post = require('../../models/Post');
const Categories = require('../../models/Categories');
const Comment = require('../../models/Comment');
const {userAuthenticated} = require('../../helpers/authentication');


router.all('/*', (req, res, next)=>{
   req.app.locals.layout =  'admin';
    next();
});

router.get('/', (req, res)=>{

    const promises = [
        Post.count().exec(),
        Categories.count().exec(),
        Comment.count().exec()
    ];

    Promise.all(promises).then(([postCount, categoryCount, commentCount])=>{
        res.render('admin/index', {postCount: postCount, categoryCount: categoryCount, commentCount: commentCount});
    });





});
router.get('/dashboard', (req, res)=>{
    res.render('admin/dashboard');
});
router.get('/post', (req, res)=>{
    res.render('admin/post');
});

router.post('/generate-fake-posts', (req, res)=>{

    for(let i = 0; i < req.body.amount; i++){
        let post = new Post();

        post.title = faker.name.title();
        post.status = 'public';
        post.allowComments = faker.random.boolean();
        post.body = faker.lorem.paragraph();

        post.save().then(savedPost=>{
            console.log('done');
        });


    }
    res.redirect('/admin/posts');
});



module.exports = router;