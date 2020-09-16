const { Schema, model } = require('mongoose');

const schema = new Schema({
	roles: ['all', 'admin', 'curator', 'student', 'teacher'],
});

module.exports = model('Role', schema);
