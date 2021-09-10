// const { SchemaComposer } = require('graphql-compose');

// const schemaComposer = new SchemaComposer();

// const { UserMutation } = require('../mutations/user');
// const { InvoiceMutation } = require('../mutations/invoice');
// const { InvoiceQuery } = require('../queries/invoice');
// const { UserQuery } = require('../queries/user');


// // schemaComposer
// schemaComposer.Query.addFields({
//   ...UserQuery,
//   ...InvoiceQuery,

//   // Attach to a field directly on the root query
// });

// schemaComposer.Mutation.addFields({
//   ...UserMutation,
//   ...InvoiceMutation,
// });

// module.exports = schemaComposer.buildSchema();

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


const ItemType = new GraphQLObjectType({
  name: 'IItem',
  fields: () => ({
    invoice: { type: GraphQLString },
    name: { type: GraphQLString },
    quantity: { type: GraphQLInt },
    price: { type: GraphQLInt },
  }),
})

const InvoiceType = new GraphQLObjectType({
  name: 'Invoice',
  fields: () => ({
    invoice_no: { type: GraphQLID },
    user: {
      type: UserType,
      resolve(parent, args) {
        return InvoiceItem.findById(parent.user_id);
      },
    },
    user_id: { type: GraphQLString },
    contact_number: { type: GraphQLString },
    address: { type: GraphQLString },
    status: { type: GraphQLString },
    total: { type: GraphQLInt },
  }),
})

// const ItemType = new GraphQLObjectType({
//   name: 'Item',
//   fields: () => ({
//     invoice: { type: GraphQLString },
//     name: { type: GraphQLString },
//     quantity: { type: GraphQLInt },
//     price: { type: GraphQLInt },
//   }),
// })

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
        return Customer.find({});
      },
    },
    invoices: {
      type: new GraphQLList(InvoiceType),
      resolve(parent, args) {
        return Invoice.find({});
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

  },
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
        total: { type: new GraphQLNonNull(GraphQLString) },
        items: { type: new GraphQLList(ItemType)},
      },
      async resolve(parent, args) {
        const total = args.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const payload = {
          user_id: args.user_id  ,
          contact_number: args.contact_number,
          address: args.address,
          total,
        }
        const invoice = await Invoice.create(payload);
        const invoiceItems = args.items.map(invItem => ({ ...invItem, invoice: invoice._id }));
        await InvoiceItem.insertMany(invoiceItems);
        return invoice;
      }
    },
    // addBook: {
    //   type: BookType,
    //   args: {
    //     name: { type: new GraphQLNonNull(GraphQLString) },
    //     genre: { type: new GraphQLNonNull(GraphQLString) },
    //     authorId: { type: new GraphQLNonNull(GraphQLID) },
    //   },
    //   resolve(parent, args) {
    //     const book = new Book({
    //       name: args.name,
    //       genre: args.genre,
    //       authorId: args.authorId
    //     });
    //     return book.save();
    //   }
    // },
  }
})


module.exports = new GraphQLSchema({ query: RootQuery, mutation: Mutation });