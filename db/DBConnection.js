var mongoose = require('mongoose');
 
function DBConnection(uri) {
    var result = mongoose.connect(uri, {
                useNewUrlParser: true,
                useCreateIndex: true,
                useUnifiedTopology: true
                })
                .catch(err => { //if there are any errors...
                    console.error('DB Connection error:', err.stack);
                    return err;
                })
                .then(() => {
                    console.log("Connection to MongoDB successfully!");
                });
    return result;
    }
     
module.exports = DBConnection;