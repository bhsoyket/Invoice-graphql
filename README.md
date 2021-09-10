# Invoice-graphql
Graphql api for invoice service with google oauth2 authentication

### Installation
```
 cd invoice
 npm install
```

### Run the project
Before run: copy `.env.example` to 	`.env`
`Note: Update env file (MONGODB_URI, PORT_URI, etc)`

To run the project `npm start`

For seeding data
- `npm run seed:user`
- `npm run seed:invoice`

Local url: `http://localhost:4000`

GraphQL url for query: `http://localhost:4000/graphql/query`

GraphQL url for mutation: `http://localhost:4000/api/v1/graphql/mutation`

`/api/v1/*` API's are secured, to access those API, user must have to logged using google oauth provider 


Run on Docker: 
- `docker compose up --build`

To run tests: `npm run test`




## Auth

### Login
```shell
description: authentication url for login using google oauth2
method: get
url: http://localhost:4000/auth/google
```

### Logout
```shell
description: authentication url for logout
method: get
url: http://localhost:4000/logout
```

## Query
### get users
```shell
method: post
url: http://localhost:4000/graphql/query
body: {
	query: `{
  users {
    name
    email
    google_id
    phone
  }
}`
}
response: {
  "data": {
    "users": [
      {
        "name": "Dexter Lueilwitz",
        "email": "Jaclyn.Sporer@hotmail.com",
        "google_id": "09de5198-7a77-4b6c-8766-34c429747214",
        "phone": null
      },
      {
        "name": "Shirley Hamill IV",
        "email": "Ramiro93@gmail.com",
        "google_id": "ae34598a-c844-4890-9100-739847639207",
        "phone": null
      },
      ...
    ]
  },
  "extensions": {
    "runTime": 57
  }
}

```



### get invoices:
```shell
method: post
url: http://localhost:4000/graphql/query
body: {
	query: `{
  invoices {
    invoice_no
    user {
      name
      email
      google_id
      phone
    }
    total
  }
}`
}
response:{
  "data": {
    "invoices": [
      {
        "invoice_no": "IVNO1631213031711406",
        "user": {
          "name": "Dexter Lueilwitz",
          "email": "Jaclyn.Sporer@hotmail.com",
          "google_id": "09de5198-7a77-4b6c-8766-34c429747214",
          "phone": null
        },
        "total": 200
      },
      {
        "invoice_no": "IVNO1631213031433813",
        "user": {
          "name": "Miss Orville Casper",
          "email": "Kianna_OKon3@yahoo.com",
          "google_id": "be7118e2-71e4-4cc6-8892-e5289922c757",
          "phone": null
        },
        "total": 41188755
      },
      ...
    ]
  },
  "extensions": {
    "runTime": 2243
  }
}

```

### get invoice with customer and items:
```shell
method: post
url: http://localhost:4000/graphql/query
body: {
	query: `{
  invoiceWithItems {
    invoice_no
    user {
      name
      email
      google_id
    }
    total
    items {
      name
      quantity
      price
    }
  }
}`
}
response: {
  "data": {
    "invoiceWithItems": [
      {
        "invoice_no": "IVNO1631213031711406",
        "user": {
          "name": "Dexter Lueilwitz",
          "email": "Jaclyn.Sporer@hotmail.com",
          "google_id": "09de5198-7a77-4b6c-8766-34c429747214"
        },
        "total": 200,
        "items": [
          {
            "name": "Small Frozen Car",
            "quantity": 56288,
            "price": 282
          },
          {
            "name": "Generic Plastic Soap",
            "quantity": 38113,
            "price": 430
          }
        ]
      },
      {
        "invoice_no": "IVNO163129677373137",
        "user": {
          "name": "Dexter Lueilwitz",
          "email": "Jaclyn.Sporer@hotmail.com",
          "google_id": "09de5198-7a77-4b6c-8766-34c429747214"
        },
        "total": 200,
        "items": []
      },
      ...
    ]
  },
  "extensions": {
    "runTime": 2263
  }
}

```


### get invoice summary:
```shell
method: post
url: http://localhost:4000/graphql/query
body: {
	query: `{
  summary {
    date
    total_invoice_count
    customers {
      invoice_count
      user {
        name
        email
        google_id
        phone
      }
    }
  }
}`
}
response: {
  "data": {
    "summary": [
      {
        "date": "2021-09-10",
        "total_invoice_count": 21,
        "customers": [
          {
            "invoice_count": 21,
            "user": {
              "name": "Dexter Lueilwitz",
              "email": "Jaclyn.Sporer@hotmail.com",
              "google_id": "09de5198-7a77-4b6c-8766-34c429747214",
              "phone": null
            }
          }
        ]
      },
      ...,
      {
        "date": "2021-08-11",
        "total_invoice_count": 1,
        "customers": [
          {
            "invoice_count": 1,
            "user": {
              "name": "Bill Jacobs",
              "email": "Bernhard82@hotmail.com",
              "google_id": "e9e4a88d-f4f7-414b-a25b-d43c1eeb83e6",
              "phone": null
            }
          }
        ]
      }
    ]
  },
  "extensions": {
    "runTime": 61
  }
}

```


## Mutation
### create invoice:
```shell
method: post
url: http://localhost:4000/api/v1/graphql/mutation
body: {
        query: `mutation {
    addInvoice(user_id: "613a55d888623939fbb4d5ad", contact_number: "01814949159", address: "yyyyyyyyyyyyyyy", status: "pending", total: 200) {
        user_id
        contact_number
        address
        status
        total
    }
    }`
}
response: {
  "data": {
    "addInvoice": {
      "user_id": "613a55d888623939fbb4d5ad",
      "contact_number": "01814949159",
      "address": "yyyyyyyyyyyyyyy",
      "status": "pending",
      "total": 200
    }
  },
  "extensions": {
    "runTime": 133
  }
}

```

### update invoice:
```shell
method: post
url: http://localhost:4000/api/v1/graphql/mutation
body: {
	query: `mutation {
  updateInvoiceById(id: "613b30d418945e99e8a14452", user_id: "613a55d888623939fbb4d5ad", contact_number: "01814949159", address: "fffffffffff", status: "pending", total: 200) {
    user_id
    contact_number
    address
    status
    total
  }
}
`
}
response: {
  "data": {
    "updateInvoiceById": {
      "user_id": "613a55d888623939fbb4d5ad",
      "contact_number": "01814949159",
      "address": "fffffffffff",
      "status": null,
      "total": 200
    }
  },
  "extensions": {
    "runTime": 58
  }
}

```
----------------------------------------------

### create invoice item:
```shell
method: post
url: http://localhost:4000/api/v1/graphql/mutation
body: {
		query: `mutation {
  addItem(invoice: "613b30d418945e99e8a14452", name: "gggggggggg", quantity: 2, price: 100) {
    invoice
    name
    quantity
    price
  }
}`
}
response: {
  "data": {
    "addItem": {
      "invoice": "613b30d418945e99e8a14452",
      "name": "gggggggggg",
      "quantity": 2,
      "price": 100
    }
  },
  "extensions": {
    "runTime": 61
  }
}

```

### update invoice item:
```shell
method: post
url: http://localhost:4000/api/v1/graphql/mutation
body: {
	query: `mutation {
  updateItemById(id: "613b3a465858fd6978e641ee", invoice: "613b30d418945e99e8a14452", name: "gggggggggg", quantity: 2, price: 100) {
    invoice
    name
    quantity
    price
  }
}
`
}
response: {
  "data": {
    "updateItemById": {
      "invoice": "613b30d418945e99e8a14452",
      "name": "gggggggggg",
      "quantity": 2,
      "price": 100
    }
  },
  "extensions": {
    "runTime": 56
  }
}

```
----------------------------------------------

# Graphql query and mutation

[more query and mutation](https://github.com/bhsoyket/Invoice-graphql/blob/master/graphql.query.txt)


