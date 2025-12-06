const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// Habilitamos CORS para que tu app móvil (o web) pueda pedir datos
app.use(cors());

// --- CONFIGURACIÓN ---
// Pon aquí tu token de Clash Royale (el que creaste en la web)
const CLASH_API_KEY = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImY4ZjkyOWFhLWU2MTEtNGZhYi04MDhhLTg3Njk3YmY4MmZiYyIsImlhdCI6MTc2NTAzNzI5Mywic3ViIjoiZGV2ZWxvcGVyL2Y3YzI3ZWY1LTA2YTktOTQ0Yi01NTc5LWY0NDFlMzE0OTA4NSIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyIxODEuMjI0LjE3NC40NSJdLCJ0eXBlIjoiY2xpZW50In1dfQ.UQrhViUPvIaE_x-iTAXODMNXvbIatSrrHClh_WIfsJoGe7JtYKOMZoUSbIddBcL1HvPNpJMJXS7lVqwipcpw6A";
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

// ... tus otras rutas ...

// --- RUTA UTILITARIA: VER MI IP ---
// Entra aquí desde tu navegador para saber qué IP poner en Clash Royale
app.get('/api/check-ip', async (req, res) => {
    try {
        // Le preguntamos a ipify.org cuál es nuestra IP pública
        const response = await axios.get('https://api.ipify.org?format=json');
        
        const ip = response.data.ip;
        console.log("La IP de salida de Render es:", ip);
        
        res.json({
            mensaje: "Copia esta IP y pégala en el panel de Clash Royale",
            ip_detectada: ip
        });

    } catch (error) {
        res.status(500).json({ error: "No pude detectar la IP" });
    }
});


// --- INICIAR SERVIDOR ---
// Usa el puerto que le asigne la nube (process.env.PORT) o el 3000 si es local
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});