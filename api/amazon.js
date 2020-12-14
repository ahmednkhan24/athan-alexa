const axios = require('axios');

const amazon = axios.create({
  baseURL: 'https://api.amazon.com'
});

module.exports = amazon;
