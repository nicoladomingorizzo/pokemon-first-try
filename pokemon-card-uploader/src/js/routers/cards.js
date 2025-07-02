// routes/cardRoutes.js

const express = require('express');
const router = express.Router(); // Crea un nuovo router
const cardController = require('../controllers/cardController'); // Importa i tuoi controller

// Definisci le rotte e associale ai metodi del controller
router.get('/', cardController.getAllCards);       // GET /api/cards
router.post('/', cardController.addCard);         // POST /api/cards
router.get('/:id', cardController.getCardById);   // GET /api/cards/:id
router.put('/:id', cardController.updateCard);    // PUT /api/cards/:id
router.delete('/:id', cardController.deleteCard); // DELETE /api/cards/:id

module.exports = router; // Esporta il router