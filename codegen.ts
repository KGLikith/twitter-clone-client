
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:8000/graphql",
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
