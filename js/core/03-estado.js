// ============================================
// ESTADO - Real vs Simulación por territorio
// ============================================

const EstadoTablero = {
    
    real: {
        territorios: {
            españa: {
                poderes: {
                    político: 0.6, económico: 0.7, financiero: 0.6,
                    militar: 0.5, judicial: 0.5, social: 0.6,
                    mediático: 0.7, religioso: 0.4, criminal: 0.3,
                    científico: 0.5, territorial: 0.6, ecosistema: 0.4
                },
                sectores: {
                    educación: 0.5, sanidad: 0.5, energía: 0.6,
                    infraestructuras: 0.6, industria: 0.5, comercio: 0.6,
                    tecnología: 0.5, agricultura: 0.5, medio_ambiente: 0.4,
                    defensa: 0.5
                },
                ultima_actualizacion: new Date().toISOString()
            },
            francia: {
                poderes: {
                    político: 0.7, económico: 0.8, financiero: 0.7,
                    militar: 0.7, judicial: 0.7, social: 0.6,
                    mediático: 0.7, religioso: 0.3, criminal: 0.2,
                    científico: 0.8, territorial: 0.7, ecosistema: 0.5
                },
                sectores: {
                    educación: 0.7, sanidad: 0.8, energía: 0.7,
                    infraestructuras: 0.8, industria: 0.7, comercio: 0.7,
                    tecnología: 0.7, agricultura: 0.6, medio_ambiente: 0.6,
                    defensa: 0.7
                },
                ultima_actualizacion: new Date().toISOString()
            },
            portugal: {
                poderes: {
                    político: 0.5, económico: 0.5, financiero: 0.5,
                    militar: 0.4, judicial: 0.5, social: 0.5,
                    mediático: 0.5, religioso: 0.4, criminal: 0.2,
                    científico: 0.4, territorial: 0.5, ecosistema: 0.5
                },
                sectores: {
                    educación: 0.5, sanidad: 0.5, energía: 0.4,
                    infraestructuras: 0.5, industria: 0.4, comercio: 0.5,
                    tecnología: 0.4, agricultura: 0.5, medio_ambiente: 0.5,
                    defensa: 0.4
                },
                ultima_actualizacion: new Date().toISOString()
            }
        }
    },
    
    simulacion: {
        territorios: {},
        historial: []
    },
    
    obtenerPoder: function(territorioId, poder) {
        if (CONFIG.modo === 'juego' && this.simulacion.territorios[territorioId]) {
            return this.simulacion.territorios[territorioId].poderes[poder] || 0.5;
        }
        return this.real.territorios[territorioId]?.poderes[poder] || 0.5;
    },
    
    setPoder: function(territorioId, poder, valor) {
        if (CONFIG.modo !== 'juego') return;
        if (!this.simulacion.territorios[territorioId]) {
            this.iniciarSimulacion(territorioId);
        }
        this.simulacion.territorios[territorioId].poderes[poder] = Math.max(0, Math.min(1, valor));
        
        this.simulacion.historial.push({
            tipo: 'poder',
            territorio: territorioId,
            poder: poder,
            valor: valor,
            timestamp: new Date().toISOString()
        });
    },
    
    iniciarSimulacion: function(territorioId) {
        if (!this.real.territorios[territorioId]) return;
        this.simulacion.territorios[territorioId] = JSON.parse(
            JSON.stringify(this.real.territorios[territorioId])
        );
    },
    
    resetSimulacion: function() {
        this.simulacion.territorios = {};
        this.simulacion.historial = [];
    }
};

window.EstadoTablero = EstadoTablero;

