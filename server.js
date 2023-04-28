const app = require('./src/app');
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`WS start with ecommerce nodejs architect BE - PORT :: ${PORT}`);
});

// process.on('SIGINT', () => {
//   server.close(() => console.log('WS closed'));
// });
