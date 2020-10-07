const { Schema, model, Types } = require('mongoose');

const schema = new Schema(
	{
		title: { type: String, required: true, unique: true },
		sorting: { type: Number },
		code: { type: String, required: true, unique: true },
		context: { type: String, required: true },
		training_id: { type: Types.ObjectId, ref: 'Training', required: true },
	},
	{ timestamps: true },
);

module.exports = model('Subject', schema);
