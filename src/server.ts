import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import schema from './schema';

const app = express();
const port = 4000;

app.use('/graphql', graphqlHTTP(req => ({
    schema: schema,
    graphiql: true,
    context: {
        userType: req.headers.usertype
    }
})));

app.listen(port, () => {
    console.log(`GraphQL server running at http://localhost:${port}/graphql`);
});
