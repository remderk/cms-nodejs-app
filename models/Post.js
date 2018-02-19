const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');
const Schema = mongoose.Schema;


const PostSchema = new Schema({

    categories: {
       type: Schema.Types.ObjectId,
       ref: 'Categories'
   },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    slug: {
        type: String
    },
   title: {
       type: String,
       required: true
   },
    status: {
        type: String,
        default: 'public'
    },
    allowComments: {
        type: Boolean,
        require: true
    },
    body: {
        type: String,
        require: true
    },
    file: {
        type: String,
    },
    date: {
       type: Date,
        default: Date.now()
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'comments'
    }]


}, {usePushEach: true});

PostSchema.plugin(URLSlugs('title', {field: 'slug'}));

module.exports =  mongoose.model('Post', PostSchema);


