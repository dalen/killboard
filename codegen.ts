import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'https://production-api.waremu.com/graphql',
  // this assumes that all your source files are in a top-level `src/` directory - you might need to adjust this to your file structure
  documents: ['src/**/*.{ts,tsx}', '!src/__generated__/**'],
  generates: {
    './src/__generated__/schema-types.ts': {
      plugins: ['typescript'],
      config: {
        enumType: 'native',
        defaultScalarType: 'any',
      },
    },
    './src/__generated__/': {
      preset: 'client',
      plugins: [
        { add: { content: `export * from './schema-types';` } },
      ],
      presetConfig: {
        gqlTagName: 'gql',
        fragmentMasking: false,
      },
      config: {
        enumType: 'native',
        enumValues: './schema-types',
        defaultScalarType: 'any',
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
