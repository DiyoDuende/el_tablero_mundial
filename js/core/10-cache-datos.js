// js/core/10-cache-datos.js
// ============================================
// CACHÉ DE DATOS - Versión 4.0
// Con compresión, actualización automática, estadísticas y sincronización
// ============================================

(function() {
    'use strict';
    
    // ============================================
    // CONFIGURACIÓN
    // ============================================
    
    const CONFIG_CACHE = {
        version: '4.0',
        duracionHoras: 24,              // Duración por defecto de la caché
        duracionMinimaHoras: 1,         // Duración mínima (para datos volátiles)
        duracionMaximaHoras: 168,       // Duración máxima (7 días)
        limpiezaAutomatica: true,       // Limpiar caché antiguo al iniciar
        comprimirDatos: true,           // Comprimir datos (eliminar campos vacíos)
        maxTamanoCache: 100,            // Máximo de entradas en caché
        actualizacionFondo: true        // Actualizar datos en segundo plano
    };
    
    // ============================================
    // ESTADÍSTICAS DE CACHÉ
    // ============================================
    
    let estadisticasCache = {
        aciertos: 0,
        fallos: 0,
        totalConsultas: 0,
        ultimaLimpieza: Date.now(),
        entradasGuardadas: 0,
        tamanoAproximado: 0
    };
    
    // ============================================
    // LISTA DE PAÍSES PRIORITARIOS
    // ============================================
    
    const PAISES_PRIORITARIOS = [
        'ESP', 'FRA', 'DEU', 'ITA', 'PRT', 'GBR', 'USA', 'CAN', 'MEX',
        'BRA', 'ARG', 'CHL', 'COL', 'PER', 'VEN', 'CHN', 'JPN', 'KOR',
        'IND', 'RUS', 'AUS', 'ZAF', 'EGY', 'MAR', 'TUR', 'SAU', 'ARE'
    ];
    
    // ============================================
    // FUNCIONES DE UTILIDAD
    // ============================================
    
    function obtenerClaveCache(iso3, tipo = 'bm') {
        return `${tipo}_${iso3}`;
    }
    
    function obtenerTodasClaves(tipo = 'bm') {
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(`${tipo}_`)) {
                keys.push(key);
            }
        }
        return keys;
    }
    
    function comprimirDatos(datos) {
        if (!CONFIG_CACHE.comprimirDatos) return datos;
        
        // Eliminar campos undefined o null
        const comprimido = {};
        for (let [key, value] of Object.entries(datos)) {
            if (value !== undefined && value !== null && value !== '') {
                if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    const subComprimido = comprimirDatos(value);
                    if (Object.keys(subComprimido).length > 0) {
                        comprimido[key] = subComprimido;
                    }
                } else {
                    comprimido[key] = value;
                }
            }
        }
        return comprimido;
    }
    
    function descomprimirDatos(datos) {
        return datos;
    }
    
    function calcularTamanoAproximado() {
        let total = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('bm_')) {
                const item = localStorage.getItem(key);
                if (item) total += item.length;
            }
        }
        return total;
    }
    
    // ============================================
    // GESTIÓN DE ACTUALIZACIONES EN SEGUNDO PLANO
    // ============================================
    
    let actualizacionesPendientes = new Map();
    let actualizacionEnProgreso = false;
    
    async function actualizarEnSegundoPlano(iso3) {
        if (!CONFIG_CACHE.actualizacionFondo) return;
        if (actualizacionesPendientes.has(iso3)) return;
        
        actualizacionesPendientes.set(iso3, true);
        
        try {
            const datos = await window.APIBancoMundial?.getTodosIndicadores(iso3);
            if (datos && datos.pib && datos.pib.valor) {
                CacheDatos.guardar(iso3, datos, { duracionHoras: CONFIG_CACHE.duracionHoras });
                console.log(`🔄 Actualización en segundo plano completada: ${iso3}`);
                
                // Disparar evento para notificar cambios
                window.dispatchEvent(new CustomEvent('cache-actualizado', {
                    detail: { iso3: iso3, datos: datos }
                }));
            }
        } catch (error) {
            console.warn(`⚠️ Error en actualización de fondo para ${iso3}:`, error);
        } finally {
            actualizacionesPendientes.delete(iso3);
            actualizacionEnProgreso = false;
        }
    }
    
    // ============================================
    // EXPORTAR API PRINCIPAL
    // ============================================
    
    const CacheDatos = {
        // Versión
        version: CONFIG_CACHE.version,
        
        // Guardar datos en caché
        guardar: function(iso3, datos, opciones = {}) {
            const duracionHoras = opciones.duracionHoras || CONFIG_CACHE.duracionHoras;
            const duracionMs = duracionHoras * 60 * 60 * 1000;
            
            const datosComprimidos = comprimirDatos(datos);
            
            const item = {
                datos: datosComprimidos,
                timestamp: Date.now(),
                expira: Date.now() + duracionMs,
                version: CONFIG_CACHE.version,
                metadatos: {
                    pais: iso3,
                    ultimaActualizacion: new Date().toISOString(),
                    duracionHoras: duracionHoras,
                    tamano: JSON.stringify(datosComprimidos).length
                }
            };
            
            try {
                localStorage.setItem(obtenerClaveCache(iso3), JSON.stringify(item));
                estadisticasCache.entradasGuardadas++;
                estadisticasCache.tamanoAproximado = calcularTamanoAproximado();
                
                // Verificar límite de tamaño
                this.gestionarTamano();
                
                console.log(`💾 Caché guardado: ${iso3} (expira en ${duracionHoras}h)`);
                return true;
            } catch (error) {
                console.error(`❌ Error guardando caché para ${iso3}:`, error);
                
                // Si hay error de cuota, limpiar caché antiguo
                if (error.name === 'QuotaExceededError') {
                    this.limpiarAntiguo();
                    try {
                        localStorage.setItem(obtenerClaveCache(iso3), JSON.stringify(item));
                        return true;
                    } catch (retryError) {
                        console.error(`❌ Error tras limpiar caché:`, retryError);
                        return false;
                    }
                }
                return false;
            }
        },
        
        // Obtener datos de caché
        obtener: function(iso3, opciones = {}) {
            const { toleranciaExpiracion = 0 } = opciones; // tolerancia en ms
            const clave = obtenerClaveCache(iso3);
            const itemRaw = localStorage.getItem(clave);
            
            estadisticasCache.totalConsultas++;
            
            if (!itemRaw) {
                estadisticasCache.fallos++;
                return null;
            }
            
            try {
                const item = JSON.parse(itemRaw);
                const expirado = Date.now() > (item.expira + toleranciaExpiracion);
                
                if (expirado) {
                    // Datos expirados, eliminarlos
                    localStorage.removeItem(clave);
                    estadisticasCache.fallos++;
                    estadisticasCache.entradasGuardadas--;
                    
                    // Actualizar en segundo plano si está configurado
                    if (CONFIG_CACHE.actualizacionFondo && !actualizacionesPendientes.has(iso3)) {
                        actualizarEnSegundoPlano(iso3);
                    }
                    
                    return null;
                }
                
                estadisticasCache.aciertos++;
                return descomprimirDatos(item.datos);
            } catch (error) {
                console.error(`❌ Error parseando caché para ${iso3}:`, error);
                localStorage.removeItem(clave);
                estadisticasCache.fallos++;
                return null;
            }
        },
        
        // Obtener datos con gestión inteligente
        async obtenerDatos(iso3, opciones = {}) {
            const { 
                forzarActualizacion = false, 
                duracionHoras = CONFIG_CACHE.duracionHoras,
                backgroundUpdate = true 
            } = opciones;
            
            // Si se fuerza actualización, ignorar caché
            if (!forzarActualizacion) {
                const cache = this.obtener(iso3);
                if (cache) {
                    return cache;
                }
            }
            
            // Consultar API
            console.log(`🌐 Consultando API para ${iso3}...`);
            const datos = await window.APIBancoMundial?.getTodosIndicadores(iso3);
            
            if (datos && datos.pib && datos.pib.valor) {
                this.guardar(iso3, datos, { duracionHoras });
            }
            
            return datos;
        },
        
        // Obtener múltiples países en paralelo
        async obtenerMultiples(iso3List, opciones = {}) {
            const resultados = {};
            const promesas = [];
            
            for (const iso3 of iso3List) {
                promesas.push(
                    this.obtenerDatos(iso3, opciones)
                        .then(datos => { resultados[iso3] = datos; })
                        .catch(error => { 
                            console.warn(`⚠️ Error obteniendo ${iso3}:`, error);
                            resultados[iso3] = null;
                        })
                );
            }
            
            await Promise.all(promesas);
            return resultados;
        },
        
        // Verificar si un país tiene caché válido
        tieneCacheValido: function(iso3) {
            const clave = obtenerClaveCache(iso3);
            const itemRaw = localStorage.getItem(clave);
            if (!itemRaw) return false;
            
            try {
                const item = JSON.parse(itemRaw);
                return Date.now() <= item.expira;
            } catch {
                return false;
            }
        },
        
        // Obtener tiempo restante de caché (en horas)
        tiempoRestante: function(iso3) {
            const clave = obtenerClaveCache(iso3);
            const itemRaw = localStorage.getItem(clave);
            if (!itemRaw) return null;
            
            try {
                const item = JSON.parse(itemRaw);
                const restante = item.expira - Date.now();
                if (restante <= 0) return 0;
                return Math.round(restante / (60 * 60 * 1000) * 10) / 10;
            } catch {
                return null;
            }
        },
        
        // Limpiar caché de un país específico
        limpiar: function(iso3 = null) {
            if (iso3) {
                const clave = obtenerClaveCache(iso3);
                if (localStorage.getItem(clave)) {
                    localStorage.removeItem(clave);
                    estadisticasCache.entradasGuardadas--;
                    console.log(`🗑️ Caché eliminado: ${iso3}`);
                }
            } else {
                const keys = obtenerTodasClaves('bm');
                keys.forEach(key => {
                    localStorage.removeItem(key);
                });
                estadisticasCache.entradasGuardadas = 0;
                estadisticasCache.aciertos = 0;
                estadisticasCache.fallos = 0;
                estadisticasCache.totalConsultas = 0;
                console.log(`🗑️ Caché completo limpiado (${keys.length} entradas)`);
            }
            
            estadisticasCache.tamanoAproximado = calcularTamanoAproximado();
        },
        
        // Limpiar solo caché expirado
        limpiarAntiguo: function() {
            const keys = obtenerTodasClaves('bm');
            let eliminados = 0;
            
            for (const key of keys) {
                const itemRaw = localStorage.getItem(key);
                if (itemRaw) {
                    try {
                        const item = JSON.parse(itemRaw);
                        if (Date.now() > item.expira) {
                            localStorage.removeItem(key);
                            eliminados++;
                            estadisticasCache.entradasGuardadas--;
                        }
                    } catch {
                        localStorage.removeItem(key);
                        eliminados++;
                    }
                }
            }
            
            estadisticasCache.ultimaLimpieza = Date.now();
            estadisticasCache.tamanoAproximado = calcularTamanoAproximado();
            
            if (eliminados > 0) {
                console.log(`🧹 Limpieza automática: ${eliminados} entradas expiradas eliminadas`);
            }
            
            return eliminados;
        },
        
        // Gestionar tamaño máximo de caché
        gestionarTamano: function() {
            const keys = obtenerTodasClaves('bm');
            if (keys.length <= CONFIG_CACHE.maxTamanoCache) return;
            
            // Ordenar por timestamp (más antiguos primero)
            const entradas = [];
            for (const key of keys) {
                const itemRaw = localStorage.getItem(key);
                if (itemRaw) {
                    try {
                        const item = JSON.parse(itemRaw);
                        entradas.push({ key, timestamp: item.timestamp });
                    } catch {
                        entradas.push({ key, timestamp: 0 });
                    }
                }
            }
            
            entradas.sort((a, b) => a.timestamp - b.timestamp);
            
            // Eliminar las más antiguas hasta estar dentro del límite
            const aEliminar = entradas.slice(0, keys.length - CONFIG_CACHE.maxTamanoCache);
            for (const entrada of aEliminar) {
                localStorage.removeItem(entrada.key);
                estadisticasCache.entradasGuardadas--;
            }
            
            console.log(`📦 Gestión de tamaño: ${aEliminar.length} entradas eliminadas`);
        },
        
        // Precargar países prioritarios
        async precargarPrioritarios: function() {
            console.log(`🔄 Precargando ${PAISES_PRIORITARIOS.length} países prioritarios...`);
            
            const resultados = await this.obtenerMultiples(PAISES_PRIORITARIOS, {
                forzarActualizacion: false,
                backgroundUpdate: false
            });
            
            const cargados = Object.values(resultados).filter(d => d !== null).length;
            console.log(`✅ Precarga completada: ${cargados}/${PAISES_PRIORITARIOS.length} países`);
            
            return resultados;
        },
        
        // Obtener estadísticas de caché
        getEstadisticas: function() {
            const aciertos = estadisticasCache.aciertos;
            const fallos = estadisticasCache.fallos;
            const total = aciertos + fallos;
            
            return {
                ...estadisticasCache,
                tasaAciertos: total > 0 ? Math.round((aciertos / total) * 100) : 0,
                entradasActivas: obtenerTodasClaves('bm').length,
                tamanoFormateado: this.formatearTamano(estadisticasCache.tamanoAproximado),
                configuracion: { ...CONFIG_CACHE }
            };
        },
        
        formatearTamano: function(bytes) {
            if (bytes < 1024) return `${bytes} B`;
            if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
            return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
        },
        
        // Obtener lista de países en caché
        getPaisesEnCache: function() {
            const keys = obtenerTodasClaves('bm');
            const paises = [];
            
            for (const key of keys) {
                const iso3 = key.replace('bm_', '');
                const tiempoRestante = this.tiempoRestante(iso3);
                if (tiempoRestante !== null && tiempoRestante > 0) {
                    paises.push({ iso3, tiempoRestanteHoras: tiempoRestante });
                }
            }
            
            return paises.sort((a, b) => b.tiempoRestanteHoras - a.tiempoRestanteHoras);
        },
        
        // Forzar actualización de un país
        async forzarActualizacion(iso3) {
            console.log(`🔄 Forzando actualización para ${iso3}...`);
            this.limpiar(iso3);
            return await this.obtenerDatos(iso3, { forzarActualizacion: true });
        },
        
        // Configurar duración personalizada por país
        setDuracionPersonalizada: function(iso3, duracionHoras) {
            const duracion = Math.max(
                CONFIG_CACHE.duracionMinimaHoras,
                Math.min(CONFIG_CACHE.duracionMaximaHoras, duracionHoras)
            );
            
            const datos = this.obtener(iso3);
            if (datos) {
                this.guardar(iso3, datos, { duracionHoras: duracion });
                console.log(`⚙️ Duración personalizada para ${iso3}: ${duracion}h`);
                return true;
            }
            return false;
        },
        
        // Inicializar sistema de caché
        init: function() {
            console.log(`🚀 Inicializando CacheDatos v${CONFIG_CACHE.version}`);
            
            estadisticasCache.tamanoAproximado = calcularTamanoAproximado();
            
            if (CONFIG_CACHE.limpiezaAutomatica) {
                this.limpiarAntiguo();
            }
            
            // Configurar limpieza periódica (cada 6 horas)
            setInterval(() => {
                if (CONFIG_CACHE.limpiezaAutomatica) {
                    this.limpiarAntiguo();
                }
            }, 6 * 60 * 60 * 1000);
            
            // Escuchar eventos de cambio de modo
            window.addEventListener('modo-cambiado', (event) => {
                if (event.detail?.modo === 'juego') {
                    // En modo juego, extender duración de caché
                    console.log('🎮 Modo juego activado - Extendiendo duración de caché');
                }
            });
            
            // Escuchar cuando el mapa esté listo para precargar
            window.addEventListener('mapa-listos', () => {
                setTimeout(() => {
                    this.precargarPrioritarios();
                }, 3000);
            });
            
            console.log(`✅ CacheDatos inicializado. Entradas activas: ${obtenerTodasClaves('bm').length}`);
        }
    };
    
    // ============================================
    // INICIALIZACIÓN AUTOMÁTICA
    // ============================================
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => CacheDatos.init());
    } else {
        setTimeout(() => CacheDatos.init(), 500);
    }
    
    // ============================================
    // EXPORTAR
    // ============================================
    
    window.CacheDatos = CacheDatos;
    window.CONFIG_CACHE = CONFIG_CACHE;
    
})();
