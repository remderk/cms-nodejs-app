const express = require('express');
const router = express.Router();
const Categories = require('../../models/Categories');
const {userAuthenticated} = require('../../helpers/authentication');


router.all('/*', (req, res, next)=>{
    req.app.locals.layout =  'admin';
    next();
});

router.get('/', (req, res)=>{

    Categories.find({}).then(categories=>{
        res.render('admin/categories/index', {categories: categories});
    });

});
router.post('/create', (req, res)=>{

    const newCategory = new Categories({
        name: req.body.name
    });
    newCategory.save(savedCategory=>{
        // req.flash('success_message', 'Category created');
        res.redirect('/admin/categories');
    });

});

router.get('/edit/:id', (req, res)=>{

    Categories.findOne({_id: req.params.id}).then(categories=>{
        res.render('admin/categories/edit', {categories: categories});
    });
});

router.put('/edit/:id', (req, res)=>{
    Categories.findOne({_id: req.params.id}).then(categories=>{
        categories.name = req.body.name;
        categories.save().then(updateCategory=>{
            res.redirect('/admin/categories');
        });

    });
});
router.delete('/:id', (req, res)=>{
    Categories.findOne({_id: req.params.id}).then(categories=>{
        categories.remove();
        res.redirect('/admin/categories');
        // req.flash('success_message', `Caregory ${categories.name} deleted`);
    });

});



// router.get('/categories/create', (req, res)=>{
//     res.render('admin/categories/create');
// });




module.exports = router;