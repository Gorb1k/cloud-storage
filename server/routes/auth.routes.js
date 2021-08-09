const Router = require("express")
const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const config = require("config")
const {check, validationResult} = require("express-validator")
const authMiddleware = require('../middleware/auth.middleware')
const fileService = require('../services/fileService')
const File = require('../models/File')
const router = new Router()

router.post('/registration', [
        check('email', 'Email is incorrect').isEmail(),
        check('password', 'Password is shorter than 3 or longer than 12 symbols').isLength({min: 3, max: 12})
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({message: "Wrong request", errors})
            }
            const {email, password} = req.body
            const candidate = await User.findOne({email})

            if (candidate) {
                return res.status(400).json({"message": `User with email: ${email} is already existed`})
            }
            const hashPassword = await bcrypt.hash(password, 3)
            const user = new User({email, password: hashPassword})
            await user.save()
            await fileService.createDir(new File({user: user.id}))
            return res.json({message: "User has been created"})


        } catch (e) {
            console.log(e)
            res.send({"message": "Server error"})
        }
    })

router.post('/login', [],
    async (req, res) => {
        try {
            const {email, password} = req.body
            const user = await User.findOne({email})
            if (!user) {
                return res.status(400).json({message: "User is not found"})
            }
            const isUserVerified = bcrypt.compareSync(password, user.password)
            if (!isUserVerified) {
                return res.status(400).json({message: "Wrong password"})
            }
            const token = jwt.sign({id: user.id}, config.get("secretKey"), {expiresIn: "1h"})
            return res.status(200).json(
                {
                    token,
                    user: {
                        id: user.id,
                        email: user.email,
                        diskSpace: user.diskSpace,
                        usedSpace: user.usedSpace,
                        avatar: user.avatar
                    }
                })
        } catch (e) {
            console.log(e)
            res.send({"message": "Server error"})
        }
    })

router.get('/auth', authMiddleware,
    async (req, res) => {
        try {
           const user = await User.findOne({_id: req.user.id})
            const token = jwt.sign({id: user.id}, config.get("secretKey"), {expiresIn: "1h"})
            return res.status(200).json(
                {
                    token,
                    user: {
                        id: user.id,
                        email: user.email,
                        diskSpace: user.diskSpace,
                        usedSpace: user.usedSpace,
                        avatar: user.avatar
                    }
                })
        } catch (e) {
            console.log(e)
            res.send({"message": "Server error"})
        }
    })
module.exports = router