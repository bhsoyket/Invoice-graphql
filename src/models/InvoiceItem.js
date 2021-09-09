const mongoose = require('mongoose');
const { Schema } = mongoose;

const InvoiceItemSchema = new Schema({
    invoice_no: { type: String, required: true },
    name: { type: Schema.Types.String },
    quantity: { type: Schema.Types.Number },
    price: { type: Schema.Types.Number },
},
    {
        versionKey: false,
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
);


module.exports = mongoose.model('InvoiceItem', InvoiceItemSchema);