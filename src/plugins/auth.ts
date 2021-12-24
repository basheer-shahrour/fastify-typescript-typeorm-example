import fastifyPlugin from "fastify-plugin";
import fastifyJwt from "fastify-jwt";
import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import * as util from "util";
export default fastifyPlugin((server: FastifyInstance, opts, next) => {
  server.register(fastifyJwt, {
    secret: process.env.JWT_SECRET as string,
  });

  server.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.send(err);
      }
    }
  );

  next();
});
