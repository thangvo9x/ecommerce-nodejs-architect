import app from './src/app.js';
const PORT = 3000;

const server = app.listen(PORT, () => {
  console.log('WS start with ecommerce nodejs architect BE');
});

// process.on('SIGINT', () => {
//   server.close(() => console.log('WS closed'));
// });
