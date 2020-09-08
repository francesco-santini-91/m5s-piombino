var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const homepageTabSchema = new Schema(
    {
        title: {
            type: String
        },
        content: {
            type: JSON
        }
    }
);

module.exports = mongoose.model('HomepageTab', homepageTabSchema);