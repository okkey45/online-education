const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
	name: { type: String, required: true, unique: true },
	description: { type: String, required: true },
	character_code: { type: String, required: true, unique: true },
	training_id: { type: Types.ObjectId, ref: 'Training', required: true },
});

module.exports = model('Group', schema);
