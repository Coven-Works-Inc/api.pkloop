exports.CLIENT_ORIGIN = process.env.NODE_ENV === 'production'
  ? 'https://pkloop.herokuapp.com/'
  : 'http://localhost:3000'