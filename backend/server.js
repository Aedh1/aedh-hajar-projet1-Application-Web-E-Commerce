// Entrée du serveur - démarre l'application Express
require('dotenv').config();
const http = require('http');
const app = require('./app');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(PORT, () => {
	console.log(`Server listening on http://localhost:${PORT} (env: ${process.env.NODE_ENV || 'development'})`);
});

// Gestion propre des signaux pour arrêter le serveur
process.on('SIGINT', () => {
	console.log('Received SIGINT, shutting down');
	server.close(() => process.exit(0));
});
