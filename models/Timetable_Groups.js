const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
	group_id: { type: Types.ObjectId, ref: 'Group', required: true },
	timetable: {
		[{ type: Types.objectId, ref: 'Subject', required: true }]: {
			type: Date,
			default: Date.now(),
		},
	},
});

module.exports = model('Timetable_Groups', schema);
