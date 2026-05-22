// js/ui/00-mapa.js
const MapaMundial = {
    map: null,
    marcadores: [],
    
    init: function() {
        this.map = L.map('mapa-mundial').setView([20, 0], 2);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(this.map);
        
        this.cargarPaises();
        
        setTimeout(() => {
            this.irAPais('españa');
        }, 500);
    },
    
    cargarPaises: function() {
        const paises = [
            { name: 'España', coords: [40.4, -3.7] },
            { name: 'Barcelona', coords: [41.3851, 2.1734] },
            { name: 'Sevilla', coords: [37.3891, -5.9845] },
            { name: 'Valencia', coords: [39.4699, -0.3763] },
            { name: 'Bilbao', coords: [43.2630, -2.9350] },
            { name: 'Francia', coords: [46.6, 2.4] },
            { name: 'Portugal', coords: [39.5, -8.0] },
            { name: 'Alemania', coords: [51.1, 10.5] },
            { name: 'Italia', coords: [41.9, 12.5] },
            { name: 'EEUU', coords: [39.8, -98.5] },
            { name: 'China', coords: [35.8, 104.1] }
        ];
        
        paises.forEach(pais => {
            const marker = L.circleMarker(pais.coords, {
                radius: 8,
                color: '#4fc3f7',
                fillColor: '#2a7faa',
                fillOpacity: 0.8
            }).addTo(this.map);
            
            marker.on('click', () => {
                this.irAPais(pais.name.toLowerCase());
            });
            
            marker.bindTooltip(pais.name);
            this.marcadores.push(marker);
        });
    },
    
    irAPais: function(paisId) {
        const centros = {
            españa: [40.4, -3.7],
            barcelona: [41.3851, 2.1734],
            sevilla: [37.3891, -5.9845],
            valencia: [39.4699, -0.3763],
            bilbao: [43.2630, -2.9350],
            francia: [46.6, 2.4],
            portugal: [39.5, -8.0],
            alemania: [51.1, 10.5],
            italia: [41.9, 12.5],
            eeuu: [39.8, -98.5],
            china: [35.8, 104.1]
        };
        
        const centro = centros[paisId] || [20, 0];
        this.map.setView(centro, 6);
        
        if (window.UIPanelInfo) {
            UIPanelInfo.mostrarPais(paisId);
        }
    },
    
    // NUEVA FUNCIÓN: buscar cualquier lugar en el mundo usando Nominatim
    buscarLugar: function(texto) {
        if (!texto || texto.trim() === '') return;
        
        const buscarInput = document.getElementById('buscador-rapido');
        const placeholderOriginal = buscarInput ? buscarInput.placeholder : '';
        if (buscarInput) buscarInput.placeholder = '🔍 Buscando...';
        
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(texto)}&limit=1&addressdetails=0`;
        
        fetch(url, {
            headers: {
                'User-Agent': 'TableroMundial/1.0'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (buscarInput) buscarInput.placeholder = placeholderOriginal;
            
            if (data && data.length > 0) {
                const lugar = data[0];
                const lat = parseFloat(lugar.lat);
                const lon = parseFloat(lugar.lon);
                this.map.setView([lat, lon], 10);
                
                const marker = L.marker([lat, lon]).addTo(this.map);
                marker.bindTooltip(lugar.display_name).openTooltip();
                setTimeout(() => this.map.removeLayer(marker), 5000);
                
                console.log(`Centrado en: ${lugar.display_name}`);
            } else {
                alert(`No se encontró el lugar: "${texto}". Intenta con otro nombre.`);
            }
        })
        .catch(error => {
            console.error('Error en Nominatim:', error);
            if (buscarInput) buscarInput.placeholder = placeholderOriginal;
            alert('Error al buscar. Revisa tu conexión o intenta más tarde.');
        });
    },
    
    activarCapa: function(capa, activa) {
        console.log(`Capa ${capa} ${activa ? 'activada' : 'desactivada'}`);
    }
};

window.MapaMundial = MapaMundial;
