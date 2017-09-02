const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const flash = require('connect-flash')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const db = require('./config/database')

const app = express()
const port = process.env.PORT || 8080

mongoose.connect(db.url)
const passportConfig = require('./config/passport')

passportConfig(passport)

app.use(morgan('dev'))
app.use(bodyParser())
app.use(cookieParser())

app.use(session({secret: 'secret to sign session id cookie'}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.set('view engine', 'ejs')
require('./app/routes')(app, passport)

app.listen(port)

console.log('The server is running . . .')
