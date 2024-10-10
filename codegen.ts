
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "https://d2vi6lqq2yi4rt.cloudfront.net/graphql",
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
