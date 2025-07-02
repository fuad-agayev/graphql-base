const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const myGraphQLschema = require('./schema')

const app = express();

app.use('/graphql', graphqlHTTP({
    schema: myGraphQLschema,
    graphiql: true
}))

app.listen(4000, () => {
  console.log('Server is running on port 4000 Fuad Project')
})