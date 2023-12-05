import express from 'express';
import { createHandler } from 'graphql-http/lib/use/express';
import expressPlayground from 'graphql-playground-middleware-express';
import schema from './schema';
const app = express();
const port = 4000;

const handler = createHandler({
    schema,
    context: async (req) => {
        const userType = (req.headers as any).usertype as string;
        return { userType };
    },
});

app.all('/graphql', handler);

app.get('/playground', expressPlayground({ endpoint: '/graphql' }));

app.listen(port, () => {
    console.log(`Server is running on PORT ${port}...`);
    console.log(`GraphQL API: http://localhost:${port}/graphql`);
    console.log(`GraphQL Playground: http://localhost:${port}/playground`);
});
