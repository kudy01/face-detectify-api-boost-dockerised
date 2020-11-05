const jwt = require('jsonwebtoken');
const redis = require("redis");
//SET UP REDIS
const redisClient = redis.createClient(process.env.REDIS_URI);

const handleSignin = (req, res, db, bcrypt) =>{
	const {email, password} = req.body;

	if(!email || !password){
		return Promise.reject('Incorrect form of submission')
	}
	return db.select('email', 'hash').from('login')
		.where('email', '=', email)
		.then(data => {
			const isValid = bcrypt.compareSync(password, data[0].hash);
			if(isValid){
				return db.select('*').from('users')
					.where('email', '=', email)
					.then(user => user[0])
					.catch(err => Promise.reject('Unable to get User'))
			}
			else{
				Promise.reject('Invalid Email or Password')
			}
		})
		.catch(err => Promise.reject('Invalid Email or Password'))

}

const getAuthTokenId = () => {
	console.log("Ok authorization")
}

const signToken = (email) => {
	const jwtPayload = { email };
	return jwt.sign(jwtPayload, 'JWT_secret', { expiresIn: '7 days'})
}

const setToken = (key, value) => {
	return Promise.resolve(redisClient.set(key, value))
}

const createSession = (user) => {
	//create jwt token and return user info 
	const { email, id } = user;
	const token = signToken(email)
	return setToken(token, id)
		.then(()=> {
			return { success: 'true', userId: id, token: token }
		})
		.catch(console.log)
}

const signinAuthentication = (db, bcrypt) => (req, res) => { //higher order as it returns another function
	const { authorization } = req.headers;
	return authorization ? getAuthTokenId() : 
	handleSignin(req, res, db, bcrypt) // handle sign in does not perform checks because it does not handle the end point anymore, instead it returns a Promise which is handled by this method.
		.then(user => {
			return user.id && user.email ?
			createSession(user) : Promise.reject(user)
		})
		.then(session => res.json(session))
		.catch(err=> res.status(400).json('Invalid Email or Password'))
} 

module.exports = {
	signinAuthentication
};