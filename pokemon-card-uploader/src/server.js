// server.js

const express = require('express');
const path = require('path');
const cors = require('cors'); // Importa il modulo CORS
const cardRoutes = require('./js/routers/cards'); // Importa le tue rotte per le carte

const app = express();
const PORT = process.env.PORT || 3000; // Porta del server

// Middleware per abilitare CORS (Cross-Origin Resource Sharing)
// possa comunicare con il tuo server backend.
app.use(cors());

// Middleware per il parsing del corpo delle richieste JSON
app.use(express.json());

// Servire i file statici dalla cartella 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Usa le rotte per le carte
// Tutte le richieste che iniziano con /api/cards verranno gestite da cardRoutes
app.use('/api/cards', cardRoutes);

// Avvia il server
app.listen(PORT, () => {
    console.log(`Server avviato su http://localhost:${PORT}`);
    console.log(`Apri http://localhost:${PORT} nel browser per il frontend.`);
});