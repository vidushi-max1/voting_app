const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    party: {
        type: String,
    },
    age: {
        type: Number,
    },
    votes: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        votedAt: {
            type: Date,
            default: Date.now()
        }
    }],
    voteCount: {
        type: Number,
        default: 0
    }
})

//create candidate model
const candidatemodel = mongoose.model('candidatemodel', candidateSchema);

//export candidate model
module.exports = candidatemodel;