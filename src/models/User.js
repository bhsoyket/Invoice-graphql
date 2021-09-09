const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    userType: { type: [String], required: true },
    google_id: { type: String },
    name: {
        type: String,
        trim: true,
        required: true,
        index: true,
    },
    email: { type: String },
    mobile: { type: String, trim: true },
    image: { type: String, required: false },
},
    {
        versionKey: false,
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
);


module.exports = mongoose.model('User', UserSchema);