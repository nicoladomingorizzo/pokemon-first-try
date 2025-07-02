// controllers/cardController.js

// Questo array simulerà il tuo database di carte Pokémon.
let pokemonCards = [];
let nextId = 1; // Per assegnare ID unici alle carte

// Funzione per validare i dati di una carta
function validateCardData(cardData, isUpdate = false) {
    const requiredFields = ['cardName', 'expansion', 'cardNumber', 'cardType'];
    for (const field of requiredFields) {
        if (!cardData[field] && !isUpdate) { // Se è un campo obbligatorio e non è un aggiornamento parziale
            return `Il campo '${field}' è richiesto.`;
        }
    }

    if (cardData.cardType === 'Pokemon') {
        if (!cardData.pokemonType) return 'Il tipo di Pokémon è richiesto.';
        if (!cardData.pokemonStage) return 'La fase del Pokémon è richiesta.';
    } else if (cardData.cardType === 'Trainer') {
        if (!cardData.trainerType) return 'Il tipo di Allenatore è richiesto.';
    } else if (cardData.cardType === 'Energy') {
        if (!cardData.energyCategory) return 'La categoria di Energia è richiesta.';
        if (cardData.energyCategory === 'Energia Base' && !cardData.baseEnergyType) {
            return 'Il tipo di Energia Base è richiesto.';
        }
    }
    return null; // Nessun errore
}

// Controller per ottenere tutte le carte (READ - GET)
exports.getAllCards = (req, res) => {
    // Restituisce l'array di tutte le carte
    res.json(pokemonCards);
};

// Controller per aggiungere una nuova carta (CREATE - POST)
exports.addCard = (req, res) => {
    const newCardData = req.body;

    const validationError = validateCardData(newCardData);
    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    // Aggiungi un ID alla nuova carta
    const newCard = { id: nextId++, ...newCardData };
    pokemonCards.push(newCard); // Aggiungi la carta all'array

    // Invia una risposta di successo con la carta creata
    res.status(201).json({ message: 'Carta aggiunta con successo!', card: newCard });
};

// Controller per ottenere una singola carta per ID (READ - GET by ID)
exports.getCardById = (req, res) => {
    const id = parseInt(req.params.id); // L'ID viene dalla URL, è una stringa, convertilo a numero
    const card = pokemonCards.find(c => c.id === id); // Cerca la carta nell'array

    if (card) {
        res.json(card);
    } else {
        res.status(404).json({ message: 'Carta non trovata.' });
    }
};

// Controller per aggiornare una carta esistente (UPDATE - PUT/PATCH)
exports.updateCard = (req, res) => {
    const id = parseInt(req.params.id);
    const updatedData = req.body;

    const validationError = validateCardData(updatedData, true); // Permette aggiornamenti parziali
    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    const cardIndex = pokemonCards.findIndex(c => c.id === id);

    if (cardIndex !== -1) {
        // Aggiorna solo i campi forniti, mantenendo quelli esistenti
        pokemonCards[cardIndex] = { ...pokemonCards[cardIndex], ...updatedData };
        res.json({ message: 'Carta aggiornata con successo!', card: pokemonCards[cardIndex] });
    } else {
        res.status(404).json({ message: 'Carta non trovata.' });
    }
};

// Controller per eliminare una carta (DELETE)
exports.deleteCard = (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = pokemonCards.length;
    // Filtra l'array rimuovendo la carta con l'ID specificato
    pokemonCards = pokemonCards.filter(c => c.id !== id);

    if (pokemonCards.length < initialLength) {
        res.json({ message: 'Carta eliminata con successo!' });
    } else {
        res.status(404).json({ message: 'Carta non trovata.' });
    }
};