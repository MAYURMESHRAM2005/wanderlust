const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
});

// Correct plugin usage (function, not object)
UserSchema.plugin(passportLocalMongoose);
console.log("PLUGIN:", typeof passportLocalMongoose);


// Correct export (schema object, not string)
module.exports = mongoose.model("User", UserSchema);
