var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const commentSchema = new Schema(
    {
        userID: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        user: {
            type: String
        },
        content: {
            type: JSON
        },
        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    }
);

module.exports = mongoose.model('Comment', commentSchema);