const { Schema, model } = require('mongoose');

const schema = new Schema({
	name: { type: String, required: true, unique: true },
	description: { type: String, required: true },
	character_code: { type: String, required: true, unique: true },
});

module.exports = model('Group', schema);
