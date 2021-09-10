const mongoose = require('mongoose');
const { Schema } = mongoose;

const CustomerSchema = new Schema({
    google_id: { type: String },
    name: {
        type: String,
        trim: true,
        required: true,
        index: true,
    },
    email: { type: String },
    phone: { type: String, trim: true },
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


module.exports = mongoose.model('Customer', CustomerSchema);