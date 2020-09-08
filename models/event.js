var mongoose = require('mongoose');
var User = require('./user');
var Schema = mongoose.Schema;

const eventSchema = new Schema(
    {
        id: {
            type: Number
        },
        title: {
            type: String
        },
        author: {
            type: String
        },
        image: {
            type: String
        },
        content: {
            type: JSON
        },
        data: {
            type: String
        },
        location: {
            type: String
        },
        participants: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    }
);

module.exports = mongoose.model('Event', eventSchema);