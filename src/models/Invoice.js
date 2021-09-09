const mongoose = require('mongoose');
const User = require('../models/user');
const userType = require('../constant/user');
const { Schema } = mongoose;

const InvoiceSchema = new Schema({
    invoice_no: {
        type: Schema.Types.String, unique: true, index: true,
    },
    user_id: { type: Schema.Types.ObjectId, required: true },
    contact_number: { type: Schema.Types.String },
    address: { type: Schema.Types.String },
    status: { type: Schema.Types.String },
    total: { type: Schema.Types.Number },

},
    {
        versionKey: false,
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
);

InvoiceSchema.pre('save', function (next) {
    if (!this.invoice_no) {
        this.invoice_no = `IVNO${Date.now()}${Math.round(Math.random() * 1000)}`;
    }
    next();
});

InvoiceSchema.post('save', async (doc, next) => {
    // add customer tag if not exists on user
    await User.findOneAndUpdate({ _id: doc.user_id },
        { $addToSet: { userType: userType.customer } });
    next();
});



module.exports = mongoose.model('Invoice', InvoiceSchema);