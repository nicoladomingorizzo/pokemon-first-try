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
        if (!cardData.cardName) { showErrorMessage('cardName'); isValid = false; } // Rimuovi il duplicato qui
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