// public/js/domHandler.js

// Dichiarazioni iniziali delle costanti globali per il DOM
const cardList = document.getElementById('card-list');
const errorMessages = {}; // Per tenere traccia dei riferimenti ai messaggi di errore
const conditionalFieldGroups = {}; // Per tenere traccia dei gruppi di campi condizionali
const selects = {}; // Per tenere traccia degli elementi select per il reset

// Inizializza i riferimenti agli elementi DOM e i gruppi di campi condizionali
export function initializeDOMElements() {
    // Campi comuni
    errorMessages.cardName = document.getElementById('error-card-name');
    errorMessages.expansion = document.getElementById('error-expansion');
    errorMessages.cardNumber = document.getElementById('error-card-number');
    errorMessages.cardType = document.getElementById('error-card-type');

    // Campi condizionali
    conditionalFieldGroups.pokemon = document.getElementById('pokemon-details-group');
    selects.pokemonType = document.getElementById('pokemon-type');
    errorMessages.pokemonType = document.getElementById('error-pokemon-type');

    conditionalFieldGroups.pokemonStage = document.getElementById('pokemon-stage-group');
    selects.pokemonStage = document.getElementById('pokemon-stage');
    errorMessages.pokemonStage = document.getElementById('error-pokemon-stage');

    conditionalFieldGroups.trainer = document.getElementById('trainer-type-group');
    selects.trainerType = document.getElementById('trainer-type');
    errorMessages.trainerType = document.getElementById('error-trainer-type');

    conditionalFieldGroups.energy = document.getElementById('energy-type-group');
    selects.energyCategory = document.getElementById('energy-category');
    errorMessages.energyCategory = document.getElementById('error-energy-category');

    conditionalFieldGroups.baseEnergy = document.getElementById('base-energy-type-group');
    selects.baseEnergyType = document.getElementById('base-energy-type');
    errorMessages.baseEnergyType = document.getElementById('error-base-energy-type');
}


/**
 * Nasconde tutti i messaggi di errore.
 */
export function hideAllErrorMessages() {
    document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');
}

/**
 * Mostra un messaggio di errore specifico.
 * @param {string} errorId - L'ID del div del messaggio di errore.
 */
export function showErrorMessage(errorId) {
    if (errorMessages[errorId]) {
        errorMessages[errorId].style.display = 'block';
    }
}

/**
 * Nasconde e resetta tutti i campi del modulo condizionali.
 */
export function hideAndResetConditionalFields() {
    // Nascondi tutti i gruppi
    Object.values(conditionalFieldGroups).forEach(group => group.classList.add('hidden-field'));

    // Resetta i valori e nascondi gli errori associati
    Object.keys(selects).forEach(key => {
        selects[key].value = ''; // Resetta il valore del select
        if (errorMessages[key]) { // Controlla se esiste un messaggio di errore associato
            errorMessages[key].style.display = 'none';
        }
    });
}

/**
 * Mostra i campi specifici per il tipo di carta Pokémon.
 */
export function showPokemonFields() {
    conditionalFieldGroups.pokemon.classList.remove('hidden-field');
    conditionalFieldGroups.pokemonStage.classList.remove('hidden-field');
}

/**
 * Mostra i campi specifici per il tipo di carta Allenatore.
 */
export function showTrainerFields() {
    conditionalFieldGroups.trainer.classList.remove('hidden-field');
}

/**
 * Mostra i campi specifici per il tipo di carta Energia.
 */
export function showEnergyFields() {
    conditionalFieldGroups.energy.classList.remove('hidden-field');
}

/**
 * Mostra i campi specifici per il tipo di Energia Base.
 */
export function showBaseEnergyTypeField() {
    conditionalFieldGroups.baseEnergy.classList.remove('hidden-field');
}

/**
 * Visualizza l'array di carte nell'area di visualizzazione.
 * @param {Array} cards - L'array di oggetti carta Pokémon.
 * @param {Function} onDeleteCallback - La funzione da chiamare quando viene cliccato il pulsante "Elimina".
 */
export function displayCards(cards, onDeleteCallback) {
    cardList.innerHTML = ''; // Pulisce la lista esistente
    if (cards.length === 0) {
        cardList.innerHTML = '<p>Nessuna carta aggiunta ancora.</p>';
        return;
    }

    cards.forEach(card => {
        const cardItem = document.createElement('div');
        cardItem.classList.add('card-item');

        let cardDetailsHtml = `
            <p><strong>Nome:</strong> ${card.cardName}</p>
            <p><strong>Espansione:</strong> ${card.expansion}</p>
            <p><strong>Numero:</strong> ${card.cardNumber}</p>
            <p><strong>Tipo:</strong> ${card.cardType}</p>
        `;

        // Aggiungi dettagli specifici se presenti
        if (card.pokemonType) {
            cardDetailsHtml += `<p><strong>Tipo Pokémon:</strong> ${card.pokemonType}</p>`;
        }
        if (card.pokemonStage) {
            cardDetailsHtml += `<p><strong>Fase Pokémon:</strong> ${card.pokemonStage}</p>`;
        }
        if (card.trainerType) {
            cardDetailsHtml += `<p><strong>Tipo Allenatore:</strong> ${card.trainerType}</p>`;
        }
        if (card.energyCategory) {
            cardDetailsHtml += `<p><strong>Categoria Energia:</strong> ${card.energyCategory}</p>`;
        }
        if (card.baseEnergyType) {
            cardDetailsHtml += `<p><strong>Tipo Energia Base:</strong> ${card.baseEnergyType}</p>`;
        }

        // Aggiungi un pulsante per eliminare la carta
        cardDetailsHtml += `<button class="delete-button" data-id="${card.id}">Elimina</button>`;

        cardItem.innerHTML = cardDetailsHtml;
        cardList.appendChild(cardItem);
    });

    // Aggiungi listener per i pulsanti di eliminazione
    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', onDeleteCallback);
    });
}
