// ============================================
// MOTOR DE SIMULACIÓN PRINCIPAL
// ============================================

const MotorSimulacion = {
    
    calcularImpacto: function(params) {
        const {
            poder = 0.5,
            sector = 0.5,
            mecanismo = 0.5,
            factorTerritorio = 1.0,
            factorEscala = 100
        } = params;
        
        const impactoBase = poder * sector * mecanismo * factorTerritorio;
        
        return {
            económico: Math.round(impactoBase * factorEscala * 1.0),
            geopolítico: Math.round(impactoBase * factorEscala * 0.8),
            social: Math.round(impactoBase * factorEscala * 0.5),
            base: impactoBase
        };
    },
    
    simular: function(params) {
        const impacto = this.calcularImpacto(params);
        
        return {
            ...params,
            impacto,
            timestamp: new Date().toISOString()
        };
    },
    
    simularEvento: function(eventoId, territorioId) {
        const evento = EVENTOS.get(eventoId);
        if (!evento) return null;
        
        const resultadoEvento = EVENTOS.aplicar(eventoId, territorioId);
        const propagacion = Propagacion.propagar(territorioId, 'territorio', evento.impactos);
        
        // Aplicar impactos locales
        for (let [poder, impacto] of Object.entries(evento.impactos)) {
            const valorActual = EstadoTablero.obtenerPoder(territorioId, poder);
            EstadoTablero.setPoder(territorioId, poder, valorActual + impacto);
        }
        
        return {
            evento: resultadoEvento,
            propagacion,
            timestamp: new Date().toISOString()
        };
    }
};

window.MotorSimulacion = MotorSimulacion;
