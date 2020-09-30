const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
	name: { type: String, required: true, unique: true },
	description: { type: String },
	character_code: { type: String, required: true, unique: true },
	training_id: { type: Types.ObjectId, ref: 'Training', required: true },
	teacher_id: { type: Types.ObjectId, ref: 'User', required: true },
	students_ids: [{ type: Types.ObjectId, ref: 'User' }],
});

module.exports = model('Group', schema);
