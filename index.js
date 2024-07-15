const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const fileStore = require('session-file-store')(session)
const flash = require('express-flash')
const port = 3000

const app = express()

const conn = require('./db/conn')

// IMPORT MODELS
const Thought = require('./models/Thought')
const User = require('./models/User')

//IMPORT CONTROLLERS
const ThoughtController = require('./controllers/ThoughtController')
const AuthController = require('./controllers/AuthController')

// IMPORT ROUTES
const thoughtsRoutes = require('./routes/thoughtsRoutes')
const authRoutes = require('./routes/authRoutes')


app.engine('handlebars', exphbs.engine())
app.set('view engine',  'handlebars')

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

app.use(
    session({
        name: 'session',
        secret: 'our_secret',
        resave: false,
        saveUninitialized: false,
        store: new fileStore({
            logFn: function() {},
            path: require('path').join(require('os').tmpdir(), 'sessions'),
        }),

        cookie: {
            secure: false,
            maxAge: 360000,
            expires: new Date(Date.now() + 360000),
            httpOnly: true
        }
    })
)

app.use(flash())
app.use(express.static('public'))

app.use((req, res, next) => {
    if(req.session.userid) {
        res.locals.session = req.session
    }

    next()
})

app.use('./thoughts', thoughtsRoutes)
app.use('/', authRoutes)

app.get('/', ThoughtController.showThoughts)
app.get('/login', AuthController.login)
app.get('/register', AuthController.register)

conn.sync().then(() => {
    app.listen(port)
}).catch((err) => console.log(err))