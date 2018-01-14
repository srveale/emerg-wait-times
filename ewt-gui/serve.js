const serve = require('serve');

console.log('serving on port 3002')

const server = serve('./build', { port: 3002 });