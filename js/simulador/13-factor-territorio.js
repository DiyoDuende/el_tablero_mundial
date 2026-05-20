// Factor Territorio
const FactorTerritorio = {
    calcular: function(datos) {
        if (!datos) return 1.0;
        // Por ahora devuelve valor neutro
        return 1.0;
    },
    describir: function(factor) {
        if (factor < 0.5) return 'Baja capacidad de impacto';
        if (factor < 0.8) return 'Capacidad limitada';
        if (factor < 1.2) return 'Capacidad media';
        if (factor < 1.6) return 'Alta capacidad';
        return 'Máxima capacidad estratégica';
    }
};
window.FactorTerritorio = FactorTerritorio;
