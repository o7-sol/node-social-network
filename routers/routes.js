const express = require('express')
const router = new express.Router()
const bcrypt = require('bcrypt')
const saltRounds = 10;
const validator = require('validator');

const User = require('./../models/user')
const Post = require('./../models/post')
const FollowUser = require('./../models/userfollow')

const sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/')
    } else {
        next();
    }    
}

router.get('/', async(req, res) => {
    try {
        if(!req.session.user || !req.cookies.user_sid) {
            return res.redirect('/login')
        }
    
        const loggedInUser = await User.findOne({username: req.session.user.username})

        const myMessages = await Post.find({username: req.session.user.username})
        const usersFollowed = await FollowUser.find({user: req.session.user.username})
        const usersThatFollowed = await usersFollowed.map(user => user.following);
        const usersThatFollowsMe = await FollowUser.find({following: req.session.user.username})
        const followersMessages = await Post.find({username: usersThatFollowed}).sort('-created_at')
        const myPosts = await Post.find({username: loggedInUser.username})

        const users = await User.find({username: {$nin: usersThatFollowed}})
        res.render('index', {loggedInUser, myPosts, followersMessages, usersThatFollowsMe, myMessages, users, username: req.session.user.username, usersThatFollowed})
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }

})

router.get('/register', sessionChecker, async(req, res) => {
    res.render('register')
})

router.post('/register', sessionChecker, async (req, res) => {

    try {
        const username = await validator.escape(req.body.username)
        const password = await validator.escape(req.body.password)
    
        bcrypt.hash(password, saltRounds, async function(err, hash) {
            const newUser = await User({
                username: username,
                password: hash,
                created_at: new Date()
            })
            const userExists = await User.findOne({username: newUser.username});

            if(!userExists) {
                newUser.save().then(() => {
                    res.render('login', {message: 'User created successfully'})
                })
            } else {
                res.redirect('/dfgdfg')
            }
      
        });        
    } catch (error) {
        console.log(error)
        res.redirect('/register')
    }

})

router.get('/user/:username', async(req, res) => {
    try {
        const user = await User.findOne({username: req.params.username})
        const userPosts = await Post.find({username: req.params.username})
        const userFollowing = await FollowUser.find({user: req.params.username})
        const userFollowers = await FollowUser.find({following: req.params.username})
        const loggedInUser = await User.findOne({username: req.session.user.username})
        res.render('profile', {user, userPosts, userFollowing, userFollowers, loggedInUser})
    } catch (error) {
        res.redirect('/')
        console.log(error)
    }
    
})

router.get('/login', sessionChecker, (req, res) => {
    res.render('login')
})

router.post('/login', async(req, res) => {
    try {
        const username = await validator.escape(req.body.username)
        const password = await validator.escape(req.body.password)
        const user = await User.findOne({username: username});

        bcrypt.compare(password, user.password, function(err, result) {
            if(result) {
                req.session.user = user
                res.redirect('/')
            }
        });        
    } catch (error) {
        res.render('login', {message: 'User with provided details is not found.'})
    }
})

router.post('/post-message', async(req, res) => {
   try {
       const newPost = await Post({
           username: validator.escape(req.session.user.username),
           data: validator.escape(req.body.postMessage),
           created_at: new Date()
       })
       newPost.save().then(() => {
           res.redirect('back')
       })
   } catch (error) {
       res.redirect('/')
   }
})

router.get('/follow-user/:username', async(req, res) => {
   try {
        const userToFollow = await User.findOne({username: req.params.username})
        const currentUser = await User.findOne({username: req.session.user.username})

        const newFollowUser = await FollowUser({
            user: currentUser.username,
            following: userToFollow.username,
            created_at: new Date()
        })

        newFollowUser.save().then(() => {
            res.redirect('back')
        })
   } catch (error) {
        res.redirect('back')
}

})

router.get('/unfollow/:username', async(req, res) => {
    try {
        const user = await User.findOne({username: req.params.username})
        FollowUser.findOneAndRemove({following: user.username, user: req.session.user.username}).then(() => {
            res.redirect('back')
        })
        
    } catch (error) {
        res.redirect('/')
    }
})

router.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid')
        res.redirect('/')
    } else {
        res.redirect('/login')
    }
});

module.exports = router