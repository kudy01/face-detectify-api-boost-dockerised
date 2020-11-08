const handleProfileGet = (req, res, db) => {
	const { id } = req.params;
	db.select('*').from('users').where({id: id})
		.then(user =>{
			if(user.length){
				res.json(user[0]);
			}
			else{
				res.status(400).json('No Such User Found');
			}
		})
		.catch(err => res.status(400).json('Error Getting the User'))
}

const handleProfileUpdate = (req, res, db) => {
	const { id } = req.params;
	const { name, age, occupation } = req.body.formInput;
	db('users').where({id: id}).update({ name, age, occupation })
		.then(resp => {
			if(resp) {
				res.json("Success")
			}
			else {
				res.status(400).json('Unable to update user information');
			}
		})
		.catch(err => res.status(400).json('Error Updating the User'))
}

module.exports = {
	handleProfileGet, // ES6 dont need value 
	handleProfileUpdate
};