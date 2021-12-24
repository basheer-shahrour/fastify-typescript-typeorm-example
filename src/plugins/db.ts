import "reflect-metadata";
import fastifyPlugin from "fastify-plugin";
import { createConnection, getConnectionOptions } from "typeorm";
import { FastifyInstance } from "fastify";
import { User } from "../modules/user/entity";

export default fastifyPlugin(async (server: FastifyInstance) => {
  try {
    const connectionOptions = await getConnectionOptions();
    Object.assign(connectionOptions, {
      options: { encrypt: true },
      entities: [User],
    });

    console.log(`connecting to database: ${connectionOptions.type}...`);
    const connection = await createConnection(connectionOptions);
    console.log("database connected");

    server.decorate("db", {
      user: connection.getRepository(User),
    });
  } catch (error) {
    console.log(error);
    console.log(
      "make sure you have set .env variables or have created ormconfig.js"
    );
  }
});
