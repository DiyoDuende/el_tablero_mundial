// js/simulador/07-motor.js
if (!window.MotorSimulacion) {
    window.MotorSimulacion = {
        simular: function(params) {
            const { poder = 0.5, sector = 0.5, mecanismo = 0.5, factorTerritorio = 1, factorEscala = 100 } = params;
            const base = poder * sector * mecanismo * factorTerritorio;
            return {
                impacto: {
                    económico: Math.round(base * factorEscala * 1.0),
                    geopolítico: Math.round(base * factorEscala * 0.8),
                    social: Math.round(base * factorEscala * 0.5)
                }
            };
        }
    };
}
