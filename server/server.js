import { ApolloServer } from "apollo-server-express";
import jwt from "jsonwebtoken";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import typeDefs from "./typeDefs.js";
import resolvers from "./resolvers.js";

const app = express();

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const authHeader = req.headers.authorization || "";
      if (!authHeader.startsWith("Bearer ")) return { user: null };

      const token = authHeader.split(" ")[1];
      try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        return { user };
      } catch (err) {
        console.log("Invalid Token:", err.message);
        return { user: null };
      }
    },
  });

  await server.start();
  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () => {
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
  });
}

startServer().catch((err) => console.error("Server failed to start:", err));
