const graphql = require('graphql');
const User = require('../models/User');
const Invoice = require('../models/Invoice');
const InvoiceItem = require('../models/InvoiceItem');
const Customer = require('../models/Customer');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLSchema } = graphql;


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
        return InvoiceItem.find({invoice: parent._id});
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

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return User.findById(args.id)
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return User.find({});
      },
    },
    customers: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return Customer.find({isCustomer: true});
      },
    },
    invoices: {
      type: new GraphQLList(InvoiceType),
      resolve(parent, args) {
        return Invoice.find({});
      },
    },
    invoice: {
      type: InvoiceType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Invoice.findById(args.id)
      },
    },
    invoiceItems: {
      type: new GraphQLList(InvoiceItemType),
      resolve(parent, args) {
        return InvoiceItem.find({});
      },
    },
    invoiceItem: {
      type: InvoiceItemType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return InvoiceItem.findById(args.id)
      },
    },
    summary: {
      type: new GraphQLList(InvoiceSummaryType),
      async resolve(parent, args) {
        const result = await Invoice.aggregate([
          {
            $group: {
              _id: {
                created_at: { $dateToString: { format: '%Y-%m-%d', date: '$created_at' } },
                user: '$user_id',
              },
              invoiceCount: { $sum: 1 },
            }
          },
          {
            $lookup: {
              from: 'users', localField: '_id.user', foreignField: '_id', as: 'userData',
            }
          },
          { $unwind: { path: '$userData', preserveNullAndEmptyArrays: true } },
          { $project: { 'userData.created_at': 0, 'userData.updated_at': 0 } },
          {
            $group: {
              _id: '$_id.created_at',
              invoices: {
                $push: {
                  user: '$userData',
                  invoice_count: '$invoiceCount',
                },
              },
              total_invoice_count: { $sum: '$invoiceCount' },
            }
          },
          { $sort: { _id: -1 } },
          {
            $project: {
              _id: 0,
              date: '$_id',
              customers: '$invoices',
              total_invoice_count: '$total_invoice_count',
            }
          },
        ]);
        console.log(result[0].customers[0].user);
        return result;
      },
    },
    invoiceWithItems: {
      type: new GraphQLList(InvoiceWithItemsType),
      async resolve(parent, args) {
        const result = Invoice.find({});
        console.log(result[0]);
        return result;
      },
    },
  },
})


module.exports = new GraphQLSchema({ query: RootQuery });