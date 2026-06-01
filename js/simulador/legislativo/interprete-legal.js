// js/simulador/legislativo/interprete-legal.js
// ============================================
// INTÉRPRETE LEGAL - Traduce leyes a lenguaje ciudadano
// ============================================

const InterpreteLegal = {
    analizarLey: function(leyId) {
        const ley = LEYES.getLey(leyId);
        if (!ley) return null;
        
        return {
            ley: ley,
            explicacionCiudadana: `Esta ley afecta al ámbito de ${ley.ambito}. Actualmente está ${ley.estado}.`,
            beneficiarios: ['Ciudadanía en general'],
            perjudicados: ['Sectores específicos por determinar']
        };
    }
};

window.InterpreteLegal = InterpreteLegal;
