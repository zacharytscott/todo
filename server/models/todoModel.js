"use strict";
exports.__esModule = true;
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Todo = new Schema({
    text: {
        type: String
    },
    completed: {
        type: Boolean
    }
});
exports["default"] = mongoose.model('Todo', Todo);
