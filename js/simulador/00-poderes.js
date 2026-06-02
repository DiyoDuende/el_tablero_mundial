// ============================================// PODERES - Los 12 poderes
// ============================================

const PODERES = {
    lista: [
        'político', 'económico', 'financiero', 'militar', 'judicial',
        'social', 'mediático', 'religioso', 'criminal', 'científico',
        'territorial', 'ecosistema'
    ],
    
    get: function(territorio, poder) {
        return EstadoTablero.obtenerPoder(territorio, poder);
    },
    
    set: function(territorio, poder, valor) {
        EstadoTablero.setPoder(territorio, poder, valor);
    },
    
    describir: function(poder) {
        const descripciones = {
            político: 'Capacidad de tomar decisiones y gobernar',
            económico: 'Producción, comercio y recursos financieros',
            financiero: 'Control sobre bancos, inversiones y capital',
            militar: 'Fuerzas armadas y capacidad de defensa',
            judicial: 'Sistema de justicia y aplicación de leyes',
            social: 'Cohesión social, bienestar y servicios públicos',
            mediático: 'Control sobre información y opinión pública',
            religioso: 'Influencia de instituciones religiosas',
            criminal: 'Actividades ilegales organizadas',
            científico: 'Investigación, innovación y conocimiento',
            territorial: 'Control sobre territorio y recursos naturales',
            ecosistema: 'Estado del medio ambiente y clima'
        };
        return descripciones[poder] || 'Poder no definido';
    }
};

window.PODERES = PODERES;
