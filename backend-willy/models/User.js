const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    isAdmin: { type: Boolean, default: false },
    imageUrl: { type: String, default: "" },
    role: { type: String, default: "user" },
    courses: { type: Array, default: [] }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
