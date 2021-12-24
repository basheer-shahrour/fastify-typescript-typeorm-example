import { Server, IncomingMessage, ServerResponse } from "http";
import { Repository } from "typeorm";

import { User } from "../../modules/user/entity";

interface Repositories {
  user: Repository<User>;
}

declare module "fastify" {
  export interface FastifyInstance<
    HttpServer = Server,
    HttpRequest = IncomingMessage,
    HttpResponse = ServerResponse
  > {
    db: Repositories;
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<VerifyPayloadType>;
  }
}
