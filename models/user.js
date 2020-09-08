var mongoose = require('mongoose');
var bcryptjs = require('bcryptjs');
var Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        avatar: {
            type: String,
        },
        name: {
            type: String,
            required: true
        },
        surname: {
            type: String,
            required: true
        },
        dateOfBirth: {
            type: Date,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        registrationDate: {
            type: Date
        },
        isConfirmed: {
            type: Boolean
        },
        isAdmin: {
            type: Boolean
        },
        isSuperUser: {
            type: Boolean
        },
        isBanned: {
            type: Boolean
        }
    }
);

userSchema.pre("save", async function(next) {
    try {
        const user = this;
        if(!this.isModified("password")) {
            next();
        }
        let password = await bcryptjs.hash(user.password, 10);
        user.password = password;

        next();
    } catch(errors) {
        return next(errors);
    }
});

module.exports = mongoose.model('User', userSchema);