// ============================================
// ACTORES - Registro global
// ============================================
const ACTORES = {
  // Estados
  estados: [
    'eeuu', 'china', 'rusia', 'alemania', 'francia', 'reino_unido',
    'españa', 'portugal', 'italia', 'japon', 'india', 'brasil',
    'canada', 'mexico', 'australia', 'corea_sur', 'turquia',
    'arabia_saudi', 'iran', 'israel', 'egipto', 'sudafrica',
    'argelia', 'marruecos', 'ucrania', 'polonia', 'suecia', 'noruega'
  ],
  // Instituciones
  instituciones: [
    'ue', 'otan', 'g7', 'g20', 'brics', 'fmi', 'banco_mundial',
    'onu', 'oms', 'oaci', 'opep', 'aie'
  ],
  // Empresas globales
  empresas: [
    'blackrock', 'vanguard', 'apple', 'microsoft', 'google',
    'amazon', 'meta', 'tsmc', 'samsung', 'shell', 'exxon',
    'iberdrola', 'repsol', 'telefonica', 'santander', 'bbva',
    'gazprom', 'total', 'bp', 'chevron', 'siemens'
  ],
  // Lista completa
  lista: function() {
    return [...this.estados, ...this.instituciones, ...this.empresas];
  }
};

window.ACTORES = ACTORES;
