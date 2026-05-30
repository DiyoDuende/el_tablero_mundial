// js/ui/00-mapa.js
// ============================================
// MAPA MUNDIAL - Versión estable v4.1
// ============================================

let mapa = null;
let capaPaises = null;

// Inicializar el mapa
function initMap() {
    if (mapa) return;
    
    mapa = L.map('mapa-mundial').setView([20, 0], 2);
    
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; CartoDB',
        subdomains: 'abcd',
        maxZoom: 19,
        minZoom: 2
    }).addTo(mapa);
    
    cargarGeoJSON();
    console.log('🗺️ Mapa inicializado');
}

// Cargar países
function cargarGeoJSON() {
    const url = 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson';
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            capaPaises = L.geoJSON(data, {
                style: {
                    color: '#4fc3f7',
                    weight: 1,
                    fillColor: '#1a3a4a',
                    fillOpacity: 0.6
                },
                onEachFeature: function(feature, layer) {
                    const nombre = feature.properties?.ADMIN || 'Desconocido';
                    layer.bindTooltip(nombre, { sticky: true });
                    layer.on('click', () => onPaisClick(nombre));
                }
            }).addTo(mapa);
            
            console.log('✅ GeoJSON cargado');
            
            // === NUEVO: Aplicar colores después de cargar ===
            setTimeout(() => {
                if (typeof Coloreado !== 'undefined') {
                    Coloreado.aplicarColoresPIB();
                }
            }, 3000);
        })
        .catch(error => console.error('Error cargando GeoJSON:', error));
}

// Click en país
function onPaisClick(nombrePais) {
    console.log('🔍 Clic:', nombrePais);
    
    let iso3 = null;
    const nombreNorm = nombrePais.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    if (typeof APIBancoMundial !== 'undefined' && APIBancoMundial.paisesSoportados) {
        for (let [codigo, nombre] of Object.entries(APIBancoMundial.paisesSoportados)) {
            const nombreAPINorm = nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            if (nombreAPINorm === nombreNorm) {
                iso3 = codigo;
                break;
            }
        }
    }
    
    if (iso3 && typeof DashboardReal !== 'undefined') {
        DashboardReal.mostrar(iso3);
    }
}

// Buscador
function initBuscador() {
    const input = document.getElementById('buscador-global');
    const btn = document.getElementById('btn-buscar');
    
    if (!input || !btn) {
        console.log('⚠️ Buscador no encontrado');
        return;
    }
    
    btn.addEventListener('click', buscar);
    input.addEventListener('keypress', (e) => { if (e.key === 'Enter') buscar(); });
    
    console.log('🔍 Buscador iniciado');
}

function buscar() {
    const input = document.getElementById('buscador-global');
    const texto = input?.value.trim();
    if (!texto) return;
    
    if (texto.length === 3 && /^[A-Za-z]{3}$/.test(texto)) {
        const iso3 = texto.toUpperCase();
        if (typeof APIBancoMundial !== 'undefined' && APIBancoMundial.isSoportado(iso3)) {
            if (typeof DashboardReal !== 'undefined') DashboardReal.mostrar(iso3);
            return;
        }
    }
    
    if (typeof APIBancoMundial !== 'undefined' && APIBancoMundial.paisesSoportados) {
        const textoLower = texto.toLowerCase();
        for (let [iso3, nombre] of Object.entries(APIBancoMundial.paisesSoportados)) {
            if (nombre.toLowerCase() === textoLower || nombre.toLowerCase().includes(textoLower)) {
                if (typeof DashboardReal !== 'undefined') DashboardReal.mostrar(iso3);
                return;
            }
        }
    }
    
    alert(`❌ No se encontró "${texto}"`);
}

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    initBuscador();
});

// Exportar para uso global
window.initMap = initMap;
window.capaPaises = capaPaises;
