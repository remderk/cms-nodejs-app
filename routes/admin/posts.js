const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Categories = require('../../models/Categories');
const {isEmpty, uploadDir} = require('../../helpers/upload-helper');
const fs = require('fs');
const path = require('path');
const {userAuthenticated} = require('../../helpers/authentication');

// userAuthenticated

router.all('/*', (req, res, next)=>{
    req.app.locals.layout =  'admin';
    next();
});

router.get('/', (req, res)=>{

    Post.find({})
        .populate('categories')
        .then(posts=>{

                res.render('admin/posts', {posts: posts});
            });

        });

router.get('/my-posts', (req, res)=>{
    Post.find({user: req.user.id})
        .populate('categories')
        .then(posts=>{
            res.render('admin/posts/my-posts' , {posts: posts});
        });
});

router.get('/create', (req, res)=>{

    Categories.find({}).then(categories=>{
        res.render('admin/posts/create', {categories: categories});
    });


});

router.post('/create', (req, res)=>{

    let errors =[];

    if(!req.body.title){
        errors.push({message: 'please add a title'});
    }
    if(!req.body.body){
        errors.push({message: 'please add a description'});
    }

    if(errors.length > 0){
        res.render('admin/posts/create', {
           errors: errors
        })
    } else {

        let filename = 'bmw5.jpg';


        if(!isEmpty(req.files)){
            let file = req.files.file;
            filename = Date.now() + '-' + file.name;

            file.mv('./public/uploads/' + filename, (err)=>{
                if(err) throw err;
            });
        }

        let allowComments = true;
        if(req.body.allowComments){
            allowComments  = true;
        } else {
            allowComments  = false;
        }

        const newPost = new  Post({
            user: req.user.id,
            title: req.body.title,
            status: req.body.status,
            allowComments: allowComments,
            body: req.body.body,
            file: filename,
            categories: req.body.categories


        });
        newPost.save().then(savedPost=>{
            req.flash('success_message', `Post ${savedPost.title} was created succesfully `);
            res.redirect('/admin/posts');

        }).catch(error=>{
            console.log(error, ' could not save post');
        });


    }

});

router.get('/edit/:id', (req, res)=>{

    Post.findOne({_id: req.params.id}).then(post=>{
        Categories.find({}).then(categories=>{
            res.render('admin/posts/edit', {post: post, categories: categories});
        });
    });
});
router.put('/edit/:id', (req, res)=>{

    Post.findOne({_id: req.params.id})
        .then(post=>{
            if(req.body.allowComments){
                allowComments  = true;
            } else {
                allowComments  = false;
            }

            post.user = req.user.id;
        post.title = req.body.title;
        post.status = req.body.status;
        post.allowComments=  allowComments;
        post.body = req.body.body;
        post.categories = req.body.categries;


            if(!isEmpty(req.files)){
                let file = req.files.file;
                filename = Date.now() + '-' + file.name;
                post.file = filename;

                file.mv('./public/uploads/' + filename, (err)=>{
                    if(err) throw err;
                });
            }
        post.save().then(updatePost=>{
            req.flash('success_message', `Post ${updatePost.title} was updated succesfully `);
            res.redirect('/admin/posts/my-posts');
        });

    });
});

router.delete('/:id', (req,res)=>{

    Post.findOne({_id: req.params.id})
        .populate('comments')
        .then(post=>{

            fs.unlink(uploadDir + post.file, (err)=>{

                if(!post.comments < 1){
                    post.comments.forEach(comment=>{
                        comment.remove();
                    });
                }

                post.remove().then(postRemoved=>{
                    req.flash('success_message', `Post ${post.title} was deleted succesfully `);
                    res.redirect('/admin/posts/my-posts');
                });


            });



        });

});

module.exports = router;