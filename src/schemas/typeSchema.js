const graphql = require('graphql');
const User = require('../models/User');
const Invoice = require('../models/Invoice');
const InvoiceItem = require('../models/InvoiceItem');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLInt, GraphQLList } = graphql;


const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        google_id: { type: GraphQLString },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
        image: { type: GraphQLString },
    }),
})

const CustomerType = new GraphQLObjectType({
    name: 'Customer',
    fields: () => ({
        invoice_count: { type: GraphQLInt },
        user: { type: UserType },
    }),
})

const InvoiceType = new GraphQLObjectType({
    name: 'Invoice',
    fields: () => ({
        invoice_no: { type: GraphQLID },
        user: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.user_id);
            },
        },
        user_id: { type: GraphQLString },
        contact_number: { type: GraphQLString },
        address: { type: GraphQLString },
        status: { type: GraphQLString },
        total: { type: GraphQLInt },
    }),
})

const ItemType = new GraphQLObjectType({
    name: 'Item',
    fields: () => ({
        invoice: { type: GraphQLString },
        name: { type: GraphQLString },
        quantity: { type: GraphQLInt },
        price: { type: GraphQLInt },
    }),
})

const InvoiceWithItemsType = new GraphQLObjectType({
    name: 'InvoiceWithItems',
    fields: () => ({
        invoice_no: { type: GraphQLID },
        user: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.user_id);
            },
        },
        contact_number: { type: GraphQLString },
        address: { type: GraphQLString },
        status: { type: GraphQLString },
        total: { type: GraphQLInt },
        items: {
            type: new GraphQLList(ItemType),
            resolve(parent, args) {
                return InvoiceItem.find({ invoice: parent._id });
            },
        },
    }),
})

const InvoiceItemType = new GraphQLObjectType({
    name: 'InvoiceItem',
    fields: () => ({
        invoice: {
            type: InvoiceType,
            resolve(parent, args) {
                return Invoice.findById(parent.invoice);
            },
        },
        name: { type: GraphQLString },
        quantity: { type: GraphQLInt },
        price: { type: GraphQLInt },
    }),
})

const InvoiceSummaryType = new GraphQLObjectType({
    name: 'InvoiceSummaryType',
    description: 'This represent Invoices summary',
    fields: () => ({
        date: { type: GraphQLString },
        total_invoice_count: { type: GraphQLInt },
        customers: { type: new GraphQLList(CustomerType) },
    }),
});

module.exports = {
    UserType,
    CustomerType,
    InvoiceType,
    ItemType,
    InvoiceWithItemsType,
    InvoiceItemType,
    InvoiceSummaryType
}