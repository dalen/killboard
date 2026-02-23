// eslint-disable-next-line no-undef
module.exports = {
  client: {
    service: {
      name: 'ror-api',
      //url: 'https://production-api.waremu.com/graphql',
      url: 'http://localhost:5156/graphql',
    },
    excludes: ['**/__generated__/**', '**/node_modules/**'],
  },
};
