const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const user = require('../models/user'); //importing user model 
const jwt = require('jsonwebtoken');
const { generateToken, verifyToken } = require('../jwt');

//user signup
router.post('/signup', async(req, res) => {
    const data = req.body;
    try {

        //password encryption
        const pass = data.password;
        const password = await bcrypt.hashSync(pass, 8);
        data.password = password;

        //create new user object using mongoose
        const newUser = new user(data);
        const response = await newUser.save();
        console.log(response._id)

        const payload = {
            id: response._id
        }
        const token = generateToken(payload)
        res.status(200).json({ response: response, token: token }) //here sending token 
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Internal server error' });
    }
})

//user login
router.get('/login', async(req, res) => {
    const aadharcard = req.body.aadharcard;
    const password = req.body.password;
    console.log(aadharcard, password)
    try {
        const data = await user.findOne({ aadharcard: aadharcard });
        //console.log(data)
        if (!data) {
            res.status(404).json({ message: "aadharcard not found or does not match" })
        }
        const passwordMatch = await bcrypt.compare(password, data.password);
        console.log(passwordMatch)
        if (!passwordMatch) {
            res.status(404).json({ message: "password does not match" })
        } else {
            const payload = {
                id: data._id
            }
            const token = generateToken(payload)
            res.status(200).json({ token: token }); //here sending token with user id
        }
    } catch (err) {
        res.status(500).json({ message: "Internal server error" })
    }
})

// //user profile - with the help of token we need to check that respective person data
router.get('/profile', verifyToken, async(req, res) => {

    const userData = req.user;
    console.log("route", userData);
    const final = userData.id;
    //console.log(final)
    try {
        const data = await user.findOne({ _id: final })
        res.status(200).json({ data: data }); //here sending data fetched by  user id
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Internal server error" })
    }
})

//-------------------------------------------------------------------

//change password
router.put('/profile/changePassword', verifyToken, async(req, res) => {
    const userId = req.user;
    userData = userId.id;
    const { oldPassword, newPassword } = req.body; //taking current password and new passsword from user
    try {
        const temp = await user.findOne({ _id: userData });
        const passwordMatch = await bcrypt.compare(oldPassword, temp.password);
        console.log("hi", passwordMatch);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Old Password is wrong" });
        }
        // const hashedPassword = bcrypt.hashSync(newPassword, 8);
        // temp.password = hashedPassword;
        // await temp.save();
        let data = await user.findOneAndUpdate({ _id: userData }, {
            $set: { password: bcrypt.hashSync(newPassword, 8) }
        })
        return res.status(200).json({ message: "Password updated successfully" })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Internal server error" })
    }

})

module.exports = router;