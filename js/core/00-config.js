// ============================================
// CONFIGURACIÓN GLOBAL
// ============================================

const CONFIG = {
    version: '3.0',
    fecha: new Date().toISOString().split('T')[0],
    modo: 'realidad', // 'realidad' o 'juego'
    visualizacion: 'ciudadano', // 'ciudadano' o 'analista'
    
    colores: {
        minimo: '#2e7d32',
        bajo: '#388e3c',
        moderado: '#f57c00',
        alto: '#d32f2f',
        critico: '#b71c1c'
    },
    
    // APIs (para futuro)
    apis: {
        ine: 'https://servicios.ine.es/wstempus/js/ES/',
        eurostat: 'https://ec.europa.eu/eurostat/api/',
        banco_mundial: 'https://api.worldbank.org/v2/',
        ipapi: 'https://ipapi.co/json/'
    }
};

window.CONFIG = CONFIG;
