const {addBookHandler} = require('./handlers');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler,
  },
];


module.exports = routes;
