// js/ui/00-mapa.js
// ============================================
// MAPA MUNDIAL - Inicialización y control
// ============================================

let mapaGlobal = null;
let capaPaisesGlobal = null;

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
        if (mapaGlobal) return;
        
        // Crear el mapa
        mapaGlobal = L.map('mapa-mundial').setView(this.config.centro, this.config.zoom);
        
        // Capa base (OpenStreetMap)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; CartoDB',
            subdomains: 'abcd',
            maxZoom: 19,
            minZoom: 1
        }).addTo(mapaGlobal);
        
        // Cargar GeoJSON de países
        this.cargarGeoJSON();
        
        console.log('🗺️ Mapa inicializado');
    },
    
    // Cargar GeoJSON mundial
    cargarGeoJSON: function() {
        const geoJSONurl = 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson';
        
        fetch(geoJSONurl)
            .then(response => response.json())
            .then(data => {
                capaPaisesGlobal = L.geoJSON(data, {
                    style: {
                        color: '#4fc3f7',
                        weight: 1,
                        fillColor: '#1a3a4a',
                        fillOpacity: 0.6
                    },
                    onEachFeature: this.onEachFeature.bind(this)
                }).addTo(mapaGlobal);
                
                console.log('✅ GeoJSON de países cargado');
                
                // Aplicar colores PIB después de cargar el mapa
                setTimeout(() => {
                    if (typeof Coloreado !== 'undefined') {
                        Coloreado.aplicarColoresPIB();
                    } else {
                        console.log('⚠️ Coloreado no disponible aún');
                    }
                }, 2000);
                
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
        
        let iso3 = null;
        const nombreNormalizado = nombrePais.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        
        if (typeof APIBancoMundial !== 'undefined' && APIBancoMundial.paisesSoportados) {
            for (let [codigo, nombre] of Object.entries(APIBancoMundial.paisesSoportados)) {
                const nombreNormalizadoAPI = nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                if (nombreNormalizadoAPI === nombreNormalizado) {
                    iso3 = codigo;
                    break;
                }
            }
        }
        
        if (iso3 && typeof DashboardReal !== 'undefined') {
            DashboardReal.mostrar(iso3);
        } else {
            const lugar = Territorios?.buscar(nombrePais);
            if (lugar && typeof DashboardLugar !== 'undefined') {
                DashboardLugar.mostrar(lugar.id);
            } else {
                console.log(`ℹ️ No hay datos para: ${nombrePais}`);
            }
        }
    },
    
    // Centrar mapa en un país
    centrarEn: function(lat, lon, zoom = 6) {
        if (mapaGlobal) {
            mapaGlobal.setView([lat, lon], zoom);
        }
    },
    
    // Obtener instancia del mapa
    getMapa: function() {
        return mapaGlobal;
    },
    
    // Aplicar colores al mapa (wrapper para compatibilidad)
    aplicarColores: async function(tipo) {
        if (typeof Coloreado === 'undefined') {
            console.log('⚠️ Coloreado no disponible');
            return;
        }
        
        switch(tipo) {
            case 'pib':
                await Coloreado.aplicarColoresPIB();
                break;
            case 'inflacion':
                await Coloreado.aplicarColoresInflacion();
                break;
            case 'desempleo':
                await Coloreado.aplicarColoresDesempleo();
                break;
            default:
                await Coloreado.aplicarColoresPIB();
        }
    },
    
    // Restablecer colores
    resetearColores: function() {
        if (typeof Coloreado !== 'undefined') {
            Coloreado.resetearColores();
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
        
        // Buscar por ISO3 directo
        if (texto.length === 3 && /^[A-Za-z]{3}$/.test(texto)) {
            const iso3 = texto.toUpperCase();
            if (typeof APIBancoMundial !== 'undefined' && APIBancoMundial.isSoportado(iso3)) {
                if (typeof DashboardReal !== 'undefined') {
                    DashboardReal.mostrar(iso3);
                    return;
                }
            }
        }
        
        // Buscar por nombre en Banco Mundial
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
        
        // Buscar en territorios locales
        if (typeof Territorios !== 'undefined') {
            const lugar = Territorios.buscar(texto);
            if (lugar && typeof DashboardLugar !== 'undefined') {
                DashboardLugar.mostrar(lugar.id);
                return;
            }
        }
        
        alert(`❌ No se encontró "${texto}".\nPrueba con: España, Francia, Alemania, ESP, FRA...`);
    },
    
    // Método adicional para buscar desde otros componentes
    buscarTexto: function(texto) {
        if (!texto) return;
        const input = document.getElementById('buscador-global');
        if (input) {
            input.value = texto;
            this.buscar();
        }
    }
};

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    MapaGlobal.init();
    BuscadorGlobal.init();
});

// Exportar para uso global
window.MapaGlobal = MapaGlobal;
window.BuscadorGlobal = BuscadorGlobal;
