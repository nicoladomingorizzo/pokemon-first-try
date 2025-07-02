// public/js/api.js

const BASE_URL = 'http://localhost:3000/api/cards'; // L'URL del tuo backend

/**
 * Recupera tutte le carte Pokémon dal backend.
 * @returns {Promise<Array>} Un array di oggetti carta Pokémon.
 */
export async function fetchCards() {
    try {
        const response = await fetch(BASE_URL);
        if (!response.ok) {
            throw new Error(`Errore HTTP! Stato: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Errore durante il caricamento delle carte:', error);
        throw error; // Propaga l'errore per gestirlo nel chiamante
    }
}

/**
 * Invia una nuova carta Pokémon al backend.
 * @param {Object} cardData - L'oggetto con i dati della carta da inviare.
 * @returns {Promise<Object>} La risposta dal backend.
 */
export async function addCardToApi(cardData) {
    try {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cardData)
        });

        const result = await response.json();
        if (!response.ok) {
            // Se la risposta non è OK (es. 400, 500), lancia un errore con il messaggio del server
            throw new Error(result.message || 'Qualcosa è andato storto lato server.');
        }
        return result;
    } catch (error) {
        console.error('Errore di rete o server durante l\'invio della carta:', error);
        throw error;
    }
}

/**
 * Elimina una carta Pokémon dal backend tramite ID.
 * @param {number} cardId - L'ID della carta da eliminare.
 * @returns {Promise<Object>} La risposta dal backend.
 */
export async function deleteCardFromApi(cardId) {
    try {
        const response = await fetch(`${BASE_URL}/${cardId}`, {
            method: 'DELETE',
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message || `Errore HTTP durante l'eliminazione! Stato: ${response.status}`);
        }
        return result;
    } catch (error) {
        console.error('Errore durante l\'eliminazione della carta:', error);
        throw error;
    }
}