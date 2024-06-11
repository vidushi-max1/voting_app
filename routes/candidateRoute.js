const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const candidate = require('../models/candidate'); //importing candidate model 
const user = require('../models/user'); //importing user model
const jwt = require('jsonwebtoken');
const { generateToken, verifyToken } = require('../jwt');


// //to check whether admin or not
// const checkadminRole = async(userId) => {
//     try {
//         const temp = await user.findById(userId);
//         return temp.role === 'admin';
//     } catch (err) {
//         return false;
//     }
// }


//to check whether admin or not
const checkadminRole = async(userId) => {
    try {
        const temp = await user.findById(userId);
        if (temp.role === 'admin') {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });

    }
}

//to add candidate only admin role
router.post('/addCandidate', verifyToken, async(req, res) => {
    const data = req.body;
    console.log("data", data)
    try {
        const final = await checkadminRole(req.user.id); //checking with the person id, whether he/she is admin or not
        if (!final) {
            console.log("yes, It has no admin role");
            return res.status(404).json({ message: "this person has no admin role" });
        } else {
            //create new candidate object using mongoose
            const newCandidate = new candidate(data);
            const response = await newCandidate.save();
            console.log("It has admin role");
            return res.status(200).json({ response: response }) //here sending response
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Internal server error" });
    }
})

//to update candidate's data by Id (only admin role)
router.put('/:candidateId', verifyToken, async(req, res) => {
    const candidateId = req.params.candidateId;
    console.log(candidateId);
    const updatedData = req.body;
    try {
        const final = await checkadminRole(req.user.id); //checking with the person id, he/she is admin or not
        if (!final) {
            console.log("yes, It has no admin role");
            return res.status(404).json({ message: "This person has no admin role to update candidate's data" });
        } else {
            const data = await candidate.findByIdAndUpdate(candidateId, updatedData, {
                new: true, //return updated document
                runValidators: true //run mongoose validation 
            });
            console.log(data)
            if (!data) {
                return res.status(404).json({ message: "Candidate not found" });
            } else {
                console.log("Candidate data updated successfully");
                return res.status(200).json({ data: data });
            }
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Internal server error" });
    }
})

//to delete candidate's data(only admin role)
router.delete('/:candidateId', async(req, res) => {
    const candidateId = req.params.candidateId;
    try {
        const data = await candidate.findOneAndDelete({ _id: candidateId });
        if (!data) {
            return res.status(404).json({ message: "Candidate not found" });
        } else {
            console.log("person data deleted successfully");
            res.status(200).json(data);
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Internal server error" });
    }
})


module.exports = router;