import { FastifyInstance, FastifyRequest } from "fastify";
import * as bcrypt from "bcrypt";
import { LessThan } from "typeorm";

import { usersSchema, registerSchema, loginSchema } from "./schema";
import { User } from "./entity";

export default (server: FastifyInstance, options, next) => {
  server.post(
    "/register",
    { schema: registerSchema },
    async (
      request: FastifyRequest<{
        Body: User;
      }>,
      reply
    ) => {
      const user = await server.db.user.findOne({
        username: request.body.username,
      });
      if (user) return reply.status(409).send("Conflict");
      const hashedPassword = await bcrypt.hash(request.body.password, 11);
      const creationResult = await server.db.user.save({
        username: request.body.username,
        password: hashedPassword,
        phone: request.body.phone,
      });
      // TODO: delete password from reply

      // TODO: make this promise
      const accessToken = server.jwt.sign(
        { id: creationResult.id, username: request.body.username },
        { expiresIn: "2d" }
      );
      reply.status(201).send({ ...creationResult, accessToken });
    }
  );

  server.post(
    "/login",
    { schema: loginSchema },
    async (
      request: FastifyRequest<{
        Body: User;
      }>,
      reply
    ) => {
      const user = await server.db.user.findOne({
        username: request.body.username,
      });
      if (!user) return reply.status(409).send("Conflict");
      if (await bcrypt.compare(request.body.password, user.password)) {
        // TODO: make this promise
        const accessToken = server.jwt.sign(
          { id: user.id, username: request.body.username },
          { expiresIn: "2d" }
        );
        return reply.send({ ...user, accessToken });
      }

      reply.status(409).send("Conflict");
    }
  );

  server.get<{
    Querystring: { lastId: number; limit: number };
  }>(
    "/getAll",
    {
      schema: usersSchema,
      preValidation: [server.authenticate],
    },
    async (request, reply) => {
      const users = await server.db.user.find({
        where: { id: LessThan(request.query.lastId) },
        order: { id: "DESC" },
        take: request.query.limit,
      });
      reply.send(users);
    }
  );

  next();
};
