const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

const NewsSchema = new mongoose.Schema({
    newsText: { type: String, required: true },
    author: { type: String },
    postedDate: { type: Date },
    id: { type: ObjectId },
});

const NewsModel = mongoose.model("News", NewsSchema);

module.exports = NewsModel;
