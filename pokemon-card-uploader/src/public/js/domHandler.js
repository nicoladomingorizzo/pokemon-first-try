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
c.Contenuto di public / js / main.js
Ora, nel tuo file main.js, metteremo la logica principale che coordina l'applicazione, incluse le importazioni dai due nuovi moduli e gli event listener.

JavaScript

// public/js/main.js

// Importa le funzioni dagli altri moduli
import { fetchCards, addCardToApi, deleteCardFromApi } from './api.js';
import {
    initializeDOMElements,
    hideAllErrorMessages,
    showErrorMessage,
    hideAndResetConditionalFields,
    showPokemonFields,
    showTrainerFields,
    showEnergyFields,
    showBaseEnergyTypeField,
    displayCards
} from './domHandler.js';

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('pokemon-card-form');
    const cardTypeRadios = document.querySelectorAll('input[name="card-type"]');
    const energyCategorySelect = document.getElementById('energy-category');

    // Inizializza i riferimenti agli elementi DOM una volta
    initializeDOMElements();

    // Funzione per caricare le carte dal backend e visualizzarle
    async function loadCards() {
        try {
            const cards = await fetchCards();
            displayCards(cards, handleDeleteCard); // Passa la funzione delete come callback
        } catch (error) {
            // Gestione errori già loggati in api.js
            document.getElementById('card-list').innerHTML = '<p style="color: red;">Errore durante il caricamento delle carte. Assicurati che il server sia avviato.</p>';
        }
    }

    // Funzione per gestire l'eliminazione di una carta
    async function handleDeleteCard(event) {
        const cardId = event.target.dataset.id;
        if (!confirm(`Sei sicuro di voler eliminare la carta con ID ${cardId}?`)) {
            return;
        }
        try {
            await deleteCardFromApi(cardId);
            alert('Carta eliminata con successo!');
            loadCards(); // Ricarica le carte dopo l'eliminazione
        } catch (error) {
            alert(`Errore durante l'eliminazione della carta: ${error.message}`);
        }
    }

    // Aggiungi listener per il cambio del tipo di carta principale
    cardTypeRadios.forEach(radio => {
        radio.addEventListener('change', function () {
            hideAndResetConditionalFields(); // Nascondi tutti prima di mostrarne di nuovi
            const selectedType = this.value;

            if (selectedType === 'Pokemon') {
                showPokemonFields();
            } else if (selectedType === 'Trainer') {
                showTrainerFields();
            } else if (selectedType === 'Energy') {
                showEnergyFields();
            }
        });
    });

    // Listener per il cambio della categoria di energia (Base/Speciale)
    energyCategorySelect.addEventListener('change', function () {
        if (this.value === 'Energia Base') {
            showBaseEnergyTypeField();
        } else {
            // Se si cambia da "Energia Base" ad altro, nascondi il campo
            document.getElementById('base-energy-type-group').classList.add('hidden-field');
            document.getElementById('base-energy-type').value = '';
            showErrorMessage('baseEnergyType'); // Nascondi anche l'errore se presente
        }
    });

    // Gestione dell'invio del modulo
    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        hideAllErrorMessages(); // Nascondi tutti i messaggi di errore precedenti

        const cardData = {};
        let isValid = true;

        // Raccogli i dati del modulo. FormData è utile, ma per i radio e select condizionali
        // è meglio prenderli direttamente per assicurarsi di avere il valore corretto.
        cardData.cardName = document.getElementById('card-name').value.trim();
        cardData.expansion = document.getElementById('expansion').value.trim();
        cardData.cardNumber = document.getElementById('card-number').value.trim();

        const cardTypeInput = document.querySelector('input[name="card-type"]:checked');
        cardData.cardType = cardTypeInput ? cardTypeInput.value : '';

        // Validazione comune
        if (!cardData.cardName) { showErrorMessage('cardName'); isValid = false; }
        if (!cardData.cardName) { showErrorMessage('cardName'); isValid = false; } // Duplicato, dovrebbe essere solo uno
        if (!cardData.expansion) { showErrorMessage('expansion'); isValid = false; }
        if (!cardData.cardNumber || isNaN(cardData.cardNumber) || parseInt(cardData.cardNumber) <= 0) { showErrorMessage('cardNumber'); isValid = false; }
        if (!cardData.cardType) { showErrorMessage('cardType'); isValid = false; }

        // Validazione e raccolta dati condizionali
        if (cardData.cardType === 'Pokemon') {
            cardData.pokemonType = document.getElementById('pokemon-type').value;
            cardData.pokemonStage = document.getElementById('pokemon-stage').value;
            if (!cardData.pokemonType) { showErrorMessage('pokemonType'); isValid = false; }
            if (!cardData.pokemonStage) { showErrorMessage('pokemonStage'); isValid = false; }
        } else if (cardData.cardType === 'Trainer') {
            cardData.trainerType = document.getElementById('trainer-type').value;
            if (!cardData.trainerType) { showErrorMessage('trainerType'); isValid = false; }
        } else if (cardData.cardType === 'Energy') {
            cardData.energyCategory = document.getElementById('energy-category').value;
            if (!cardData.energyCategory) { showErrorMessage('energyCategory'); isValid = false; }
            if (cardData.energyCategory === 'Energia Base') {
                cardData.baseEnergyType = document.getElementById('base-energy-type').value;
                if (!cardData.baseEnergyType) { showErrorMessage('baseEnergyType'); isValid = false; }
            }
        }

        if (!isValid) {
            return; // Ferma l'invio se la validazione fallisce
        }

        // Invio dei dati al backend tramite la funzione di api.js
        try {
            const result = await addCardToApi(cardData);
            alert(result.message);
            form.reset();
            hideAndResetConditionalFields(); // Nascondi e resetta i campi dopo l'invio
            loadCards(); // Ricarica le carte per mostrare quella appena aggiunta
        } catch (error) {
            alert(`Errore: ${error.message}`);
        }
    });

    // Carica le carte all'avvio della pagina
    loadCards();
});