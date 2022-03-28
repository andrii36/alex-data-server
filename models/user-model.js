const {Schema, model} = require('mongoose')

const UserSchema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    isActivated: {type: Boolean, default: true},
    userName: {type: String, required: true},
    date: {type: Date, default: Date.now},
    role: {type: String, default: "user"}
})

module.exports = model('User', UserSchema)