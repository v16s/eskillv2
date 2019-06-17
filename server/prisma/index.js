"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_lib_1 = require("prisma-client-lib");
var typeDefs = require("./prisma-schema").typeDefs;

var models = [
  {
    name: "User",
    embedded: false
  },
  {
    name: "Global",
    embedded: false
  },
  {
    name: "Tag",
    embedded: true
  },
  {
    name: "Campus",
    embedded: false
  },
  {
    name: "Branch",
    embedded: false
  },
  {
    name: "Course",
    embedded: false
  },
  {
    name: "Question",
    embedded: false
  },
  {
    name: "Options",
    embedded: true
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `http://localhost:4466`
});
exports.prisma = new exports.Prisma();
