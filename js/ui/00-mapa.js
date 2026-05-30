// js/ui/00-mapa.js
// ============================================
// MAPA MUNDIAL - Inicialización y control
// ============================================

let mapa = null;
let capaPaises = null;

const MapaGlobal = {
    // Configuración inicial
    config: {
        centro: [20, 0],
        zoom: 2,
        minZoom: 2,
        maxZoom: 10
    },
    
    // Inicializar el mapa
    init: function() {
        if (mapa) return;
        
        // Crear el mapa
        mapa = L.map('mapa-mundial').setView(this.config.centro, this.config.zoom);
        
        // Capa base (OpenStreetMap)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; CartoDB',
            subdomains: 'abcd',
            maxZoom: 19,
            minZoom: 1
        }).addTo(mapa);
        
        // Cargar GeoJSON de países
        this.cargarGeoJSON();
        
        console.log('🗺️ Mapa inicializado');
    },
    
    // Cargar GeoJSON mundial
    cargarGeoJSON: function() {
        // URL de GeoJSON de países (archivo local o remoto)
        const geoJSONurl = 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson';
        
        fetch(geoJSONurl)
            .then(response => response.json())
            .then(data => {
                capaPaises = L.geoJSON(data, {
                    style: {
                        color: '#4fc3f7',
                        weight: 1,
                        fillColor: '#1a3a4a',
                        fillOpacity: 0.6
                    },
                    onEachFeature: this.onEachFeature.bind(this)
                }).addTo(mapa);
                
                console.log('✅ GeoJSON de países cargado');
                
                // Disparar evento
                window.dispatchEvent(new CustomEvent('mapa-listos'));
            })
            .catch(error => {
                console.error('❌ Error cargando GeoJSON:', error);
            });
    },
    
    // Manejar cada feature del GeoJSON
    onEachFeature: function(feature, layer) {
        const nombre = feature.properties?.ADMIN || feature.properties?.name || 'Desconocido';
        
        // Tooltip
        layer.bindTooltip(nombre, { sticky: true });
        
        // Click en el país
        layer.on('click', () => {
            this.onPaisClick(nombre);
        });
    },
    
    // Manejar clic en país
    onPaisClick: function(nombrePais) {
        console.log('🔍 Clic en país:', nombrePais);
        
        // Buscar código ISO3
        let iso3 = null;
        
        // Buscar por nombre normalizado
        const nombreNormalizado = nombrePais.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        
        // Recorrer países soportados
        if (typeof APIBancoMundial !== 'undefined' && APIBancoMundial.paisesSoportados) {
            for (let [codigo, nombre] of Object.entries(APIBancoMundial.paisesSoportados)) {
                const nombreNormalizadoAPI = nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                if (nombreNormalizadoAPI === nombreNormalizado) {
                    iso3 = codigo;
                    break;
                }
            }
        }
        
        // Mostrar dashboard
        if (iso3 && typeof DashboardReal !== 'undefined') {
            DashboardReal.mostrar(iso3);
        } else {
            // Buscar en territorios locales
            const lugar = Territorios?.buscar(nombrePais);
            if (lugar && typeof DashboardLugar !== 'undefined') {
                DashboardLugar.mostrar(lugar.id);
            } else {
                console.log(`ℹ️ No hay datos para: ${nombrePais}`);
                this.mostrarMensajeTemporal(`🌍 ${nombrePais}\nSelecciona un país con datos económicos disponibles`);
            }
        }
    },
    
    // Mostrar mensaje temporal
    mostrarMensajeTemporal: function(mensaje) {
        const container = document.getElementById('dashboard-container');
        if (container) {
            const html = `
                <div class="dashboard-error" style="text-align:center; padding:30px;">
                    <div class="error-icono" style="font-size:2rem;">🌍</div>
                    <p style="margin-top:10px;">${mensaje}</p>
                    <p style="font-size:0.8rem; color:#9aaec2;">Prueba con: España, Francia, Alemania...</p>
                </div>
            `;
            container.innerHTML = html;
        }
    },
    
    // Centrar mapa en un país
    centrarEn: function(lat, lon, zoom = 6) {
        if (mapa) {
            mapa.setView([lat, lon], zoom);
        }
    }
};

// ============================================
// BUSCADOR GLOBAL
// ============================================

const BuscadorGlobal = {
    init: function() {
        const input = document.getElementById('buscador-global');
        const btn = document.getElementById('btn-buscar');
        
        if (!input || !btn) {
            console.log('⚠️ Buscador no encontrado en el DOM');
            return;
        }
        
        btn.addEventListener('click', () => this.buscar());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.buscar();
        });
        
        console.log('🔍 Buscador global inicializado');
    },
    
    buscar: function() {
        const input = document.getElementById('buscador-global');
        const texto = input?.value.trim();
        if (!texto) return;
        
        console.log('🔍 Buscando:', texto);
        
        // 1. Buscar por código ISO3 directo
        if (texto.length === 3 && /^[A-Za-z]{3}$/.test(texto)) {
            const iso3 = texto.toUpperCase();
            if (typeof APIBancoMundial !== 'undefined' && APIBancoMundial.isSoportado(iso3)) {
                if (typeof DashboardReal !== 'undefined') {
                    DashboardReal.mostrar(iso3);
                }
                return;
            }
        }
        
        // 2. Buscar por nombre en paises del Banco Mundial
        if (typeof APIBancoMundial !== 'undefined' && APIBancoMundial.paisesSoportados) {
            const textoLower = texto.toLowerCase();
            for (let [iso3, nombre] of Object.entries(APIBancoMundial.paisesSoportados)) {
                if (nombre.toLowerCase() === textoLower || nombre.toLowerCase().includes(textoLower)) {
                    if (typeof DashboardReal !== 'undefined') {
                        DashboardReal.mostrar(iso3);
                        return;
                    }
                }
            }
        }
        
        // 3. Buscar en territorios locales
        if (typeof Territorios !== 'undefined') {
            const lugar = Territorios.buscar(texto);
            if (lugar) {
                if (typeof DashboardLugar !== 'undefined') {
                    DashboardLugar.mostrar(lugar.id);
                    return;
                }
            }
        }
        
        // 4. No encontrado
        alert(`❌ No se encontró "${texto}".\nPrueba con: España, Francia, Alemania, ESP, FRA...`);
    }
};

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar mapa
    MapaGlobal.init();
    
    // Inicializar buscador
    BuscadorGlobal.init();
    
    // Cuando el mapa esté listo, mostrar España por defecto
    window.addEventListener('mapa-listos', () => {
        setTimeout(() => {
            if (typeof DashboardReal !== 'undefined') {
                DashboardReal.mostrar('ESP');
            }
        }, 500);
    });
});

// Exportar para uso global
window.MapaGlobal = MapaGlobal;
window.BuscadorGlobal = BuscadorGlobal;
