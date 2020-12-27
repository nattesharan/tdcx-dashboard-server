const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const taskSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: 'Name cannot be blank'
    },
    is_completed: {
        type: Boolean,
        default: false
    }
}, {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}});

module.exports = mongoose.model('task', taskSchema);