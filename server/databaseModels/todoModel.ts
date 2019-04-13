import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Todo = new Schema({
    text : {
        type : String
    },
    completed : {
        type : Boolean
    }
})

export default mongoose.model('Todo', Todo);