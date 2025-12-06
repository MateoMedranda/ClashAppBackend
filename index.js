const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// Habilitamos CORS para que tu app móvil (o web) pueda pedir datos
app.use(cors());

// --- CONFIGURACIÓN ---
// Pon aquí tu token de Clash Royale (el que creaste en la web)
const CLASH_API_KEY = "TU_TOKEN_API_AQUI_MUY_LARGO";
const BASE_URL = "https://api.clashroyale.com/v1";

// --- RUTA (ENDPOINT) ---
// Tu app Flutter llamará a: http://tu-ip-o-dominio/api/cards
app.get('/api/cards', async (req, res) => {
    try {
        // 1. El servidor recibe la petición de Flutter
        console.log("Recibida petición de Flutter...");

        // 2. El servidor llama a Clash Royale con el Token seguro
        const response = await axios.get(`${BASE_URL}/cards`, {
            headers: {
                'Authorization': `Bearer ${CLASH_API_KEY}`
            }
        });

        // 3. Devolvemos los datos limpios a Flutter
        res.json(response.data);

    } catch (error) {
        console.error("Error conectando a Clash Royale:", error.message);
        // Si falla, devolvemos error 500
        res.status(500).json({ error: 'Error al obtener cartas' });
    }
});

app.get('/api/clans', async (req, res) => {
    try {
        console.log("Buscando clanes...");
        
        // 'req.query' captura lo que envíes después del '?' (minMembers, name, etc.)
        // y se lo pasa automáticamente a la API de Clash Royale.
        const response = await axios.get(`${BASE_URL}/clans?minMembers=5&maxMembers=100`, {
            params: req.query, 
            headers: {
                'Authorization': `Bearer ${CLASH_API_KEY}`
            }
        });

        res.json(response.data);

    } catch (error) {
        console.error("Error buscando clanes:", error.message);
        res.status(500).json({ error: 'Error al buscar clanes' });
    }
});
// --- INICIAR SERVIDOR ---
// Usa el puerto que le asigne la nube (process.env.PORT) o el 3000 si es local
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});