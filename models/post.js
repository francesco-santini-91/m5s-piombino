var mongoose = require('mongoose');
var Comment = require('./comment');
var Schema = mongoose.Schema;

const postSchema = new Schema(
    {
        id: {
            type: Number
        },
        title: {
            type: String
        },
        urlTitle: {
            type: String
        },
        subtitle: {
            type: String
        },
        content: {
            type: JSON
        },
        image: {
            type: String
        },
        author: {
            type: String
        },
        data: {
            type: Date
        },
        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        comments: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Comment'
            }
        ]
    }
);

module.exports = mongoose.model('Post', postSchema);