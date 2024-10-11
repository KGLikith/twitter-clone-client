
import type { CodegenConfig } from '@graphql-codegen/cli';
import env from "dotenv"

env.config();

const config: CodegenConfig = {
  overwrite: true,
  schema: "https://d1sv5yadi7eom3.cloudfront.net/graphql",
  documents: ['src/**/*.{tsx,ts}'],
  generates: {
    "src/gql/": {
      preset: "client",
      plugins: []
    },
    "./src/graphql.schema.json": {
      plugins: ["introspection"]
    }
  }
};

export default config;
