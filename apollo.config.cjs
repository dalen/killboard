// eslint-disable-next-line no-undef
module.exports = {
  client: {
    service: {
      name: 'ror-api',
      url: 'https://production-api.waremu.com/graphql',
    },
    excludes: ['**/__generated__/**', '**/node_modules/**'],
  },
};
