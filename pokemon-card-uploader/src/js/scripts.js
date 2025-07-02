// This file contains JavaScript code for handling form submissions, validations, and any dynamic interactions within the interface.

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('pokemon-card-form');
    const cardList = document.getElementById('card-list');
    const cardTypeRadios = document.querySelectorAll('input[name="card-type"]');

    // Riferimenti ai nuovi gruppi di campi e ai loro input
    const pokemonDetailsGroup = document.getElementById('pokemon-details-group');
    const pokemonTypeSelect = document.getElementById('pokemon-type');
    const pokemonStageGroup = document.getElementById('pokemon-stage-group');
    const pokemonStageSelect = document.getElementById('pokemon-stage');

    const trainerTypeGroup = document.getElementById('trainer-type-group');
    const trainerTypeSelect = document.getElementById('trainer-type');

    const energyTypeGroup = document.getElementById('energy-type-group');
    const energyCategorySelect = document.getElementById('energy-category');

    const baseEnergyTypeGroup = document.getElementById('base-energy-type-group');
    const baseEnergyTypeSelect = document.getElementById('base-energy-type');

    // Funzione per nascondere tutti i campi condizionali e resettare i loro valori
    function hideAllConditionalFields() {
        pokemonDetailsGroup.classList.add('hidden-field');
        pokemonTypeSelect.value = ''; // Resetta il valore
        document.getElementById('error-pokemon-type').style.display = 'none';

        pokemonStageGroup.classList.add('hidden-field');
        pokemonStageSelect.value = ''; // Resetta il valore
        document.getElementById('error-pokemon-stage').style.display = 'none';

        trainerTypeGroup.classList.add('hidden-field');
        trainerTypeSelect.value = ''; // Resetta il valore
        document.getElementById('error-trainer-type').style.display = 'none';

        energyTypeGroup.classList.add('hidden-field');
        energyCategorySelect.value = ''; // Resetta il valore
        document.getElementById('error-energy-category').style.display = 'none';

        baseEnergyTypeGroup.classList.add('hidden-field');
        baseEnergyTypeSelect.value = ''; // Resetta il valore
        document.getElementById('error-base-energy-type').style.display = 'none';
    }

    // Aggiungi un listener per il cambio del tipo di carta principale
    cardTypeRadios.forEach(radio => {
        radio.addEventListener('change', function () {
            hideAllConditionalFields(); // Nascondi tutti prima di mostrarne di nuovi
            const selectedType = this.value;

            if (selectedType === 'Pokemon') {
                pokemonDetailsGroup.classList.remove('hidden-field');
                pokemonStageGroup.classList.remove('hidden-field');
            } else if (selectedType === 'Trainer') {
                trainerTypeGroup.classList.remove('hidden-field');
            } else if (selectedType === 'Energy') {
                energyTypeGroup.classList.remove('hidden-field');
            }
        });
    });

    // Listener per il cambio della categoria di energia (Base/Speciale)
    energyCategorySelect.addEventListener('change', function () {
        // Nascondi il tipo di energia base se non è "Energia Base"
        if (this.value !== 'Energia Base') {
            baseEnergyTypeGroup.classList.add('hidden-field');
            baseEnergyTypeSelect.value = ''; // Resetta il valore
            document.getElementById('error-base-energy-type').style.display = 'none';
        } else {
            baseEnergyTypeGroup.classList.remove('hidden-field');
        }
    });


    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Previene l'invio predefinito del modulo (ricaricamento della pagina)

        // Nascondi tutti i messaggi di errore precedenti
        document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');

        // Ottieni i valori degli input del modulo e rimuovi gli spazi bianchi
        const cardName = document.getElementById('card-name').value.trim();
        const expansion = document.getElementById('expansion').value.trim();
        const cardNumber = document.getElementById('card-number').value.trim();
        const cardTypeInput = document.querySelector('input[name="card-type"]:checked');
        // Gestisce il caso in cui nessun radio button sia selezionato
        const cardType = cardTypeInput ? cardTypeInput.value : '';

        let isValid = true; // Flag di validazione

        // Controlli di validazione degli input base
        if (!cardName) {
            document.getElementById('error-card-name').style.display = 'block';
            isValid = false;
        }
        if (!expansion) {
            document.getElementById('error-expansion').style.display = 'block';
            isValid = false;
        }
        // Controlla se il numero della carta è vuoto, non è un numero o non è positivo
        if (!cardNumber || isNaN(cardNumber) || parseInt(cardNumber) <= 0) {
            document.getElementById('error-card-number').style.display = 'block';
            isValid = false;
        }
        if (!cardType) {
            document.getElementById('error-card-type').style.display = 'block';
            isValid = false;
        }

        // Validazione campi condizionali
        let pokemonType = '';
        let pokemonStage = '';
        let trainerType = '';
        let energyCategory = '';
        let baseEnergyType = '';

        if (cardType === 'Pokemon') {
            pokemonType = pokemonTypeSelect.value;
            pokemonStage = pokemonStageSelect.value;
            if (!pokemonType) {
                document.getElementById('error-pokemon-type').style.display = 'block';
                isValid = false;
            }
            if (!pokemonStage) {
                document.getElementById('error-pokemon-stage').style.display = 'block';
                isValid = false;
            }
        } else if (cardType === 'Trainer') {
            trainerType = trainerTypeSelect.value;
            if (!trainerType) {
                document.getElementById('error-trainer-type').style.display = 'block';
                isValid = false;
            }
        } else if (cardType === 'Energy') {
            energyCategory = energyCategorySelect.value;
            if (!energyCategory) {
                document.getElementById('error-energy-category').style.display = 'block';
                isValid = false;
            }
            if (energyCategory === 'Energia Base') {
                baseEnergyType = baseEnergyTypeSelect.value;
                if (!baseEnergyType) {
                    document.getElementById('error-base-energy-type').style.display = 'block';
                    isValid = false;
                }
            }
        }


        if (!isValid) {
            return; // Ferma l'esecuzione se la validazione fallisce
        }

        // Elabora i dati del modulo (in questo esempio li visualizziamo sulla pagina)
        console.log('Nome Carta:', cardName);
        console.log('Espansione:', expansion);
        console.log('Numero Carta:', cardNumber);
        console.log('Tipo Carta:', cardType);
        if (pokemonType) console.log('Tipo Pokémon:', pokemonType);
        if (pokemonStage) console.log('Fase Pokémon:', pokemonStage);
        if (trainerType) console.log('Tipo Allenatore:', trainerType);
        if (energyCategory) console.log('Categoria Energia:', energyCategory);
        if (baseEnergyType) console.log('Tipo Energia Base:', baseEnergyType);


        // Crea un nuovo elemento div per visualizzare la carta aggiunta
        const cardItem = document.createElement('div');
        cardItem.classList.add('card-item'); // Aggiungi una classe per lo stile

        let cardDetailsHtml = `
            <p><strong>Nome:</strong> ${cardName}</p>
            <p><strong>Espansione:</strong> ${expansion}</p>
            <p><strong>Numero:</strong> ${cardNumber}</p>
            <p><strong>Tipo:</strong> ${cardType}</p>
        `;

        if (pokemonType) {
            cardDetailsHtml += `<p><strong>Tipo Pokémon:</strong> ${pokemonType}</p>`;
        }
        if (pokemonStage) {
            cardDetailsHtml += `<p><strong>Fase Pokémon:</strong> ${pokemonStage}</p>`;
        }
        if (trainerType) {
            cardDetailsHtml += `<p><strong>Tipo Allenatore:</strong> ${trainerType}</p>`;
        }
        if (energyCategory) {
            cardDetailsHtml += `<p><strong>Categoria Energia:</strong> ${energyCategory}</p>`;
        }
        if (baseEnergyType) {
            cardDetailsHtml += `<p><strong>Tipo Energia Base:</strong> ${baseEnergyType}</p>`;
        }

        cardItem.innerHTML = cardDetailsHtml;

        // Se è la prima carta aggiunta, rimuovi il messaggio "Nessuna carta aggiunta ancora."
        if (cardList.querySelector('p')) {
            cardList.innerHTML = '';
        }
        cardList.appendChild(cardItem); // Aggiungi la nuova carta alla lista

        // Resetta il form dopo l'invio riuscito
        form.reset();
        hideAllConditionalFields(); // Nascondi di nuovo tutti i campi condizionali
    });
});
