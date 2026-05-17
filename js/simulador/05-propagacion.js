// ============================================
// PROPAGACIÓN - Efectos en cadena
// ============================================
const Propagacion = {
  coeficientes: {
    local: 1.0,
    regional: 0.5,
    continental: 0.3,
    global: 0.1
  },
  distancias: {
    españa: { regional: 'europa', continental: 'europa' },
    francia: { regional: 'europa', continental: 'europa' },
    portugal: { regional: 'europa', continental: 'europa' },
    alemania: { regional: 'europa', continental: 'europa' },
    eeuu: { global: 'mundo' },
    china: { global: 'mundo' }
  },
  propagar: function(origen, tipoOrigen, impactos) {
    const resultados = [];
    const zona = this.distancias[origen] || { regional: null, continental: origen, global: 'mundo' };
    for (let [poder, impacto] of Object.entries(impactos)) {
      // Local
      resultados.push({
        destino: origen,
        poder,
        impacto,
        nivel: 'local',
        coeficiente: 1.0
      });
      // Regional
      if (zona.regional) {
        resultados.push({
          destino: zona.regional,
          poder,
          impacto: impacto * this.coeficientes.regional,
          nivel: 'regional',
          coeficiente: this.coeficientes.regional
        });
      }
      // Continental
      if (zona.continental && zona.continental !== origen) {
        resultados.push({
          destino: zona.continental,
          poder,
          impacto: impacto * this.coeficientes.continental,
          nivel: 'continental',
          coeficiente: this.coeficientes.continental
        });
      }
      // Global
      resultados.push({
        destino: 'mundo',
        poder,
        impacto: impacto * this.coeficientes.global,
        nivel: 'global',
        coeficiente: this.coeficientes.global
      });
    }
    return {
      origen,
      propagaciones: resultados,
      timestamp: new Date().toISOString()
    };
  }
};

window.Propagacion = Propagacion;
