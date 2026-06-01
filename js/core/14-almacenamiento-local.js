// js/core/14-almacenamiento-local.js
// ============================================
// ALMACENAMIENTO LOCAL - localStorage mejorado
// ============================================

const AlmacenamientoLocal = {
    // Prefijos para organizar datos
    PREFIJOS: {
        DATOS: 'tm_datos_',
        PREFERENCIAS: 'tm_pref_',
        CACHE: 'tm_cache_',
        HISTORIAL: 'tm_hist_'
    },
    
    // Duración en horas
    DURACION_HORAS: {
        datos: 24,
        preferencias: 720, // 30 días
        cache: 24,
        historial: 168 // 7 días
    },
    
    // Guardar datos con timestamp
    guardar(tipo, clave, valor, duracionHoras = null) {
        try {
            const prefijo = this.PREFIJOS[tipo] || this.PREFIJOS.DATOS;
            const duracion = duracionHoras || this.DURACION_HORAS[tipo.toLowerCase()] || 24;
            
            const item = {
                valor: valor,
                creado: Date.now(),
                expira: Date.now() + (duracion * 60 * 60 * 1000),
                tipo: tipo
            };
            
            localStorage.setItem(`${prefijo}${clave}`, JSON.stringify(item));
            console.log(`💾 Guardado: ${tipo}/${clave}`);
            return true;
        } catch(e) {
            console.error('Error guardando:', e);
            return false;
        }
    },
    
    // Obtener datos con validación de expiración
    obtener(tipo, clave) {
        try {
            const prefijo = this.PREFIJOS[tipo] || this.PREFIJOS.DATOS;
            const rawItem = localStorage.getItem(`${prefijo}${clave}`);
            
            if (!rawItem) return null;
            
            const item = JSON.parse(rawItem);
            
            // Verificar expiración
            if (Date.now() > item.expira) {
                this.eliminar(tipo, clave);
                return null;
            }
            
            return item.valor;
        } catch(e) {
            console.error('Error obteniendo:', e);
            return null;
        }
    },
    
    // Guardar preferencias de usuario
    guardarPreferencia(clave, valor) {
        return this.guardar('PREFERENCIAS', clave, valor, 720);
    },
    
    obtenerPreferencia(clave, valorPorDefecto = null) {
        const valor = this.obtener('PREFERENCIAS', clave);
        return valor !== null ? valor : valorPorDefecto;
    },
    
    // Guardar en historial
    guardarHistorial(evento, datos) {
        const historial = this.obtener('HISTORIAL', 'eventos') || [];
        historial.push({
            timestamp: Date.now(),
            evento: evento,
            datos: datos
        });
        // Mantener solo los últimos 100 eventos
        if (historial.length > 100) historial.shift();
        this.guardar('HISTORIAL', 'eventos', historial, 168);
    },
    
    obtenerHistorial() {
        return this.obtener('HISTORIAL', 'eventos') || [];
    },
    
    // Limpiar todo
    limpiarTodo() {
        const keys = Object.keys(localStorage);
        let eliminados = 0;
        
        keys.forEach(key => {
            if (key.startsWith('tm_')) {
                localStorage.removeItem(key);
                eliminados++;
            }
        });
        
        console.log(`🧹 Caché limpiada: ${eliminados} elementos`);
        return eliminados;
    },
    
    // Obtener estadísticas
    obtenerEstadisticas() {
        const keys = Object.keys(localStorage).filter(k => k.startsWith('tm_'));
        let stats = {
            total: keys.length,
            por_tipo: {},
            activos: 0,
            expirados: 0
        };
        
        keys.forEach(key => {
            try {
                const item = JSON.parse(localStorage.getItem(key));
                const tipo = item.tipo || 'desconocido';
                
                stats.por_tipo[tipo] = (stats.por_tipo[tipo] || 0) + 1;
                
                if (Date.now() < item.expira) {
                    stats.activos++;
                } else {
                    stats.expirados++;
                }
            } catch(e) {}
        });
        
        return stats;
    },
    
    // Eliminar un elemento específico
    eliminar(tipo, clave) {
        const prefijo = this.PREFIJOS[tipo] || this.PREFIJOS.DATOS;
        localStorage.removeItem(`${prefijo}${clave}`);
    },
    
    // Exportar datos (para análisis)
    exportar() {
        const keys = Object.keys(localStorage).filter(k => k.startsWith('tm_'));
        const datos = {};
        
        keys.forEach(key => {
            try {
                datos[key] = JSON.parse(localStorage.getItem(key));
            } catch(e) {}
        });
        
        return JSON.stringify(datos, null, 2);
    }
};

window.AlmacenamientoLocal = AlmacenamientoLocal;
console.log('✅ Almacenamiento Local cargado');
