const { Schema, model, Types } = require('mongoose');

const schema = new Schema(
	{
		title: { type: String, required: true, unique: true },
		code: { type: String, required: true, unique: true },
		description: { type: String },
		detail_text: { type: String },
		author_id: { type: Types.ObjectId, ref: 'User', required: true },
		subject_ids: [{ type: Types.ObjectId, ref: 'Subject' }],
	},
	{ timestamps: true },
);

module.exports = model('Training', schema);
