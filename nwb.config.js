module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'Greta',
      externals: {
        react: 'React'
      }
    }
  }
}
