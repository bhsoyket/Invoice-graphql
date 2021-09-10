const graphql = require('graphql');
const Invoice = require('../models/Invoice');
const InvoiceItem = require('../models/InvoiceItem');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLSchema } = graphql;
const { InvoiceType, ItemType } = require('./typeSchema');


const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    invoice: {
      type: InvoiceType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Invoice.findById(args.id)
      },
    },
  }
})


const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addInvoice: {
      type: InvoiceType,
      args: {
        user_id: { type: new GraphQLNonNull(GraphQLString) },
        contact_number: { type: new GraphQLNonNull(GraphQLString) },
        address: { type: new GraphQLNonNull(GraphQLString) },
        status: { type: new GraphQLNonNull(GraphQLString) },
        total: { type: new GraphQLNonNull(GraphQLInt) },
      },
      async resolve(parent, args) {
        // const total = args.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const payload = {
          user_id: args.user_id,
          contact_number: args.contact_number,
          address: args.address,
          status: args.status,
          total: parseInt(args.total, 10),
        }
        const invoice = await Invoice.create(payload);
        // const invoiceItems = args.items.map(invItem => ({ ...invItem, invoice: invoice._id }));
        // await InvoiceItem.insertMany(invoiceItems);
        return invoice;
      }
    },
    updateInvoiceById: {
      type: InvoiceType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        user_id: { type: new GraphQLNonNull(GraphQLString) },
        contact_number: { type: new GraphQLNonNull(GraphQLString) },
        address: { type: new GraphQLNonNull(GraphQLString) },
        status: { type: new GraphQLNonNull(GraphQLString) },
        total: { type: new GraphQLNonNull(GraphQLInt) },
      },
      async resolve(parent, args) {
        const payload = {
          user_id: args.user_id,
          contact_number: args.contact_number,
          address: args.address,
          total: parseInt(args.total, 10),
        }
        const invoice = await Invoice.findByIdAndUpdate({ _id: args.id }, payload, { new: true });
        return invoice;
      }
    },
    addItem: {
      type: ItemType,
      args: {
        invoice: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        quantity: { type: new GraphQLNonNull(GraphQLInt) },
        price: { type: new GraphQLNonNull(GraphQLInt) },
      },
      async resolve(parent, args) {
        const payload = {
          invoice: args.invoice,
          name: args.name,
          quantity: parseInt(args.quantity, 10),
          price: parseInt(args.price, 10)
        }
        return await InvoiceItem.create(payload);
      }
    },
    updateItemById: {
      type: ItemType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        invoice: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        quantity: { type: new GraphQLNonNull(GraphQLInt) },
        price: { type: new GraphQLNonNull(GraphQLInt) },
      },
      async resolve(parent, args) {
        const payload = {
          invoice: args.invoice,
          name: args.name,
          quantity: parseInt(args.quantity, 10),
          price: parseInt(args.price, 10)
        }
        return await InvoiceItem.findByIdAndUpdate({ _id: args.id }, payload, { new: true });
      }
    },
  }
})


module.exports = new GraphQLSchema({ query: RootQuery, mutation: Mutation });