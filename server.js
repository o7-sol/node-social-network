const mongoose = require('mongoose')
const connectDB = require('./db/connect')
const bodyParser = require('body-parser')
const express = require('express')
const hbs = require('hbs')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const routes = require('./routers/routes')

const app = express()

app.use(express.static('public'))
app.set('view engine', 'hbs')
app.set('view options', { layout: './layouts/main-layout' })

hbs.registerPartials('./views/partials')

app.use(bodyParser.urlencoded({ extended: true }));

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  key: 'user_sid',
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, expires: 600000 }
}))

app.use(cookieParser())

app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid')      
    }
    next();
})

app.use(routes)

app.listen(3000, () => {
    console.log('SERVER IS RUNNING ON PORT 3000')
})