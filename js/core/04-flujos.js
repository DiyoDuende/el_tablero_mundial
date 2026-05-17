// ============================================
// FLUJOS - Redes económicas
// ============================================
const FLUJOS = {
  tipos: ['energía', 'comercio', 'capital', 'datos', 'personas', 'tecnología'],
  correspondencia: {
    económico: ['comercio', 'capital'],
    energía: ['energía'],
    tecnología: ['tecnología', 'datos'],
    militar: ['tecnología'],
    social: ['personas'],
    agricultura: ['comercio']
  },
  matriz: {
    energia: {
      rusia: { alemania: 0.4, italia: 0.3, francia: 0.2, españa: 0.1 },
      argelia: { españa: 0.5, italia: 0.3, portugal: 0.2 },
      arabia_saudi: { china: 0.5, japon: 0.4, india: 0.3 }
    },
    comercio: {
      china: { eeuu: 0.6, alemania: 0.4, españa: 0.2, francia: 0.2 },
      eeuu: { china: 0.5, mexico: 0.4, alemania: 0.3, japon: 0.2 },
      alemania: { francia: 0.4, eeuu: 0.3, china: 0.3 }
    },
    capital: {
      eeuu: { china: 0.5, reino_unido: 0.4, japon: 0.3, alemania: 0.3 },
      ue: { eeuu: 0.4, china: 0.3, japon: 0.2 }
    },
    tecnologia: {
      eeuu: { china: 0.3, alemania: 0.3, japon: 0.3, corea_sur: 0.3 },
      china: { eeuu: 0.2, alemania: 0.2, japon: 0.2 }
    }
  },
  elasticidades: {
    energía: 0.2,
    comercio: 0.6,
    capital: 0.8,
    datos: 0.8,
    personas: 0.5,
    tecnología: 0.7
  },
  getFlujo: function(tipo, origen, destino) {
    return this.matriz[tipo]?.[origen]?.[destino] || 0;
  },
  getFlujosPorTipo: function(poder) {
    return this.correspondencia[poder] || [];
  },
  calcularImpactoFlujos: function(poder, impacto, actorOrigen) {
    const tipos = this.getFlujosPorTipo(poder);
    const impactos = [];
    for (let tipo of tipos) {
      for (let origen in (this.matriz[tipo] || {})) {
        for (let destino in (this.matriz[tipo][origen] || {})) {
          if (origen === actorOrigen || destino === actorOrigen) {
            const flujo = this.matriz[tipo][origen][destino];
            impactos.push({
              tipo,
              origen,
              destino,
              flujoOriginal: flujo,
              nuevoFlujo: flujo * (1 + impacto * 0.3)
            });
          }
        }
      }
    }
    return impactos;
  }
};

window.FLUJOS = FLUJOS;
