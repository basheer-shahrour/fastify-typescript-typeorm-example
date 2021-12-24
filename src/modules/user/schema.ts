export const userSchema = {
  id: { type: "integer" },
  username: { type: "string" },
  password: { type: "string" },
  active: { type: "boolean" },
  created_at: { type: "string", format: "date-time" },
};

export const usersSchema = {
  summary: "get all users",
  description: "users",
  tags: ["User"],
  querystring: {
    type: "object",
    required: ["lastId", "limit"],
    properties: {
      lastId: { type: "integer" },
      limit: { type: "integer" },
    },
  },
  response: {
    200: {
      type: "array",
      items: {
        properties: userSchema,
      },
    },
  },
};

export const registerSchema = {
  summary: "register a new user",
  description: "register a new user",
  tags: ["User"],
  body: {
    type: "object",
    required: ["username", "password", "phone"],
    properties: {
      username: { type: "string" },
      password: { type: "string" },
      phone: { type: "string" },
    },
  },
  response: {
    201: {
      type: "object",
      properties: userSchema,
      execute: ["password"],
    },
  },
};

export const loginSchema = {
  summary: "login a user",
  description: "login a user",
  tags: ["User"],
  body: {
    type: "object",
    required: ["username", "password"],
    properties: {
      username: { type: "string" },
      password: { type: "string" },
    },
  },
  response: {
    200: {
      type: "object",
      properties: userSchema,
      execute: ["password"],
    },
  },
};
