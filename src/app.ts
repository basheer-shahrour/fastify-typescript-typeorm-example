import fastify, { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import fastifyCORS from "fastify-cors";

import auth from "./plugins/auth";
import db from "./plugins/db";

// Config
import env from "./config/env";

// Handlers
import userHandler from "./modules/user/routes";

const server = fastify({ logger: { prettyPrint: true } });
server.register(fastifyCORS);

server.register(require("fastify-oas"), {
  routePrefix: "/docs",
  exposeRoute: true,
  swagger: {
    info: {
      title: "Project",
      description: "API Documentation",
      version: "0.0.1",
    },
    servers: [{ url: "http://localhost:3000", description: "development" }],
    schemes: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
    security: [{ bearerAuth: [] }],
    securityDefinitions: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    tags: [{ name: "User" }],
    hideUntagged: true,
  },
});

server.register(db);
server.register(auth);

server.setErrorHandler(
  (error: FastifyError, request: FastifyRequest, replay: FastifyReply) => {
    request.log.error(error.toString());
    replay.send({ error });
  }
);

server.register(userHandler, { prefix: "api/user" });

server.listen(process.env.PORT || 3000, "0.0.0.0", (err, address) => {
  if (err) throw err;
  console.log(`server listening on ${address}`);
  const token = server.jwt.sign({ user_id: "user_id" }, { expiresIn: "2d" });
  console.log(token);
  console.log(env);
});
