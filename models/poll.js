var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const pollSchema = new Schema(
    {
        title: {
            type: String
        },
        author: {
            type: String
        },
        data: {
            type: Date
        },
        content: {
            type: JSON
        },
        isActive: {
            type: Boolean
        },
        voters: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        options: []
    }
);

module.exports = mongoose.model('Poll', pollSchema);