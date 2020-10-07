const { Schema, model } = require('mongoose');

const schema = new Schema(
	{
		name: { type: String, trim: true, required: true, max: 64 },
		email: {
			type: String,
			trim: true,
			lowercase: true,
			required: true,
			unique: true,
		},
		password: { type: String, required: true },
		roles: { type: Array, required: true },
	},
	{ timestamps: true },
);

module.exports = model('User', schema);
