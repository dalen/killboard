// eslint-disable-next-line no-undef
module.exports = {
  client: {
    excludes: ['**/__generated__/**', '**/node_modules/**'],
    service: {
      name: 'ror-api',
      url: 'https://production-api.waremu.com/graphql',
    },
  },
};
