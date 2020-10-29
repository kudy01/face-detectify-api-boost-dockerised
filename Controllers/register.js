

const handleRegister = (req, res, db, bcrypt) =>{
	const {email, name, password} = req.body;
	if(!email || !name || !password){
				
		return res.status(400).json('Incorrect form of submission')
	}
	const hash = bcrypt.hashSync(password);
		// starting a transaction as we are doing more than two things, namely inserting info into the users and login table as both should contain the details of a new user
		db.transaction(trx => {
			trx.insert({
				hash: hash,
				email: email
			})
			.into('login')
			.returning('email')
			.then(loginEmail => {
				return trx('users')
					.returning('*')
					.insert({
						email: loginEmail[0],
						name: name,
						joined: new Date()
					})
					.then(user => {
						res.json(user[0])
					})
			})
			.then(trx.commit)
			.catch(trx.rollback)
		})
		.catch(err => res.status(400).json('unable to register'))
}

module.exports = {
	handleRegister: handleRegister
};