const express = require('express');
const app = express();
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt-nodejs');
const morgan = require('morgan');

const register = require('./Controllers/register');
const signin = require('./Controllers/signin');
const profile = require('./Controllers/profile');
const image = require('./Controllers/image');
const auth = require('./Controllers/authorization')

const db = knex({
	client: 'pg',
  	connection: process.env.POSTGRES_URI
});

app.use(morgan('combined'))
app.use(cors())
app.use(express.json()); // as body is json

//app.get('/', (req, res) => { res.send(db.users)})

app.post('/signin', signin.signinAuthentication(db, bcrypt))
app.post('/register', register.registerAuthentication(db, bcrypt))
app.get('/profile/:id', auth.requireAuth , (req, res) => { profile.handleProfileGet(req, res, db)})
app.post('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileUpdate(req, res, db)})
app.put('/image', auth.requireAuth,  (req, res) => { image.handleImage(req, res, db)})
app.post('/imageurl', auth.requireAuth, (req, res) => { image.handleApiCall(req, res)})

app.listen(3000, ()=> {
	console.log('App is running on port 3000'); 
})


