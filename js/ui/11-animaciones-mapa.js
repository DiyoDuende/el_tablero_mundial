// js/ui/11-animaciones-mapa.js
// ============================================
// ANIMACIONES MAPA - Efectos visuales
// ============================================

const AnimacionesMapa = {
    // Pulsing en países
    animar_pulsing(layer) {
        const original = layer.getStyle();
        let opacidad = 0.7;
        let incremento = 0.1;
        
        setInterval(() => {
            opacidad += incremento;
            if (opacidad >= 1 || opacidad <= 0.5) {
                incremento *= -1;
            }
            layer.setStyle({ fillOpacity: opacidad });
        }, 200);
    },
    
    // Brillo al pasar ratón
    animar_brillo(layer) {
        layer.on('mouseover', () => {
            layer.setStyle({
                weight: 3,
                color: '#FFD700',
                fillOpacity: 0.9
            });
            layer.bringToFront();
        });
        
        layer.on('mouseout', () => {
            layer.setStyle({
                weight: 1,
                color: '#666',
                fillOpacity: 0.7
            });
        });
    },
    
    // Animación de clic
    animar_clic(layer) {
        layer.on('click', () => {
            layer.setStyle({
                weight: 2,
                dashArray: '5, 5',
                color: '#FF4444'
            });
            
            setTimeout(() => {
                layer.setStyle({
                    weight: 1,
                    dashArray: '',
                    color: '#666'
                });
            }, 500);
        });
    },
    
    // Animación de zoom en país
    zoom_animado(mapa, lat, lon, zoom = 6, duracion = 1000) {
        const inicio = mapa.getZoom();
        const finZoom = zoom;
        const inicioLat = mapa.getCenter().lat;
        const inicioLon = mapa.getCenter().lng;
        const pasos = 20;
        const intervalo = duracion / pasos;
        let paso = 0;
        
        const animar = () => {
            if (paso <= pasos) {
                const progreso = paso / pasos;
                const latActual = inicioLat + (lat - inicioLat) * progreso;
                const lonActual = inicioLon + (lon - inicioLon) * progreso;
                const zoomActual = inicio + (finZoom - inicio) * progreso;
                
                mapa.setView([latActual, lonActual], zoomActual, { animate: true });
                paso++;
                setTimeout(animar, intervalo);
            }
        };
        
        animar();
    },
    
    // Onda de expansión en punto
    onda_expansion(mapa, lat, lon, radio = 100000, color = '#FF4444') {
        const puntos = [];
        const capas = 5;
        
        for (let i = 0; i < capas; i++) {
            const radioPulsante = radio + (i * 50000);
            
            L.circle([lat, lon], {
                radius: radioPulsante,
                color: color,
                weight: 2,
                opacity: 1 - (i / capas),
                fillOpacity: 0,
                interactive: false
            }).addTo(mapa);
        }
    },
    
    // Transición suave de colores
    transicion_color(layer, colorInicio, colorFin, duracion = 1000) {
        const pasos = 20;
        const intervalo = duracion / pasos;
        let paso = 0;
        
        const hexToRgb = (hex) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? [
                parseInt(result[1], 16),
                parseInt(result[2], 16),
                parseInt(result[3], 16)
            ] : null;
        };
        
        const rgbToHex = (r, g, b) => {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        };
        
        const inicio = hexToRgb(colorInicio);
        const fin = hexToRgb(colorFin);
        
        if (!inicio || !fin) return;
        
        const animar = () => {
            if (paso <= pasos) {
                const progreso = paso / pasos;
                const r = Math.round(inicio[0] + (fin[0] - inicio[0]) * progreso);
                const g = Math.round(inicio[1] + (fin[1] - inicio[1]) * progreso);
                const b = Math.round(inicio[2] + (fin[2] - inicio[2]) * progreso);
                
                layer.setStyle({ fillColor: rgbToHex(r, g, b) });
                paso++;
                setTimeout(animar, intervalo);
            }
        };
        
        animar();
    },
    
    // Inicializar todas las animaciones
    inicializar(mapaLayer) {
        if (!mapaLayer) return;
        
        mapaLayer.eachLayer((layer) => {
            this.animar_brillo(layer);
            this.animar_clic(layer);
        });
        
        console.log('✨ Animaciones inicializadas');
    }
};

window.AnimacionesMapa = AnimacionesMapa;
console.log('✅ Animaciones de Mapa cargadas');
