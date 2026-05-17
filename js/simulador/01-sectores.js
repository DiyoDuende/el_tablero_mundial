// ============================================
// SECTORES - Los 10 sectores
// ============================================
const SECTORES = {
  lista: [
    'educación', 'sanidad', 'energía', 'infraestructuras',
    'industria', 'comercio', 'tecnología', 'agricultura',
    'medio_ambiente', 'defensa'
  ],
  get: function(territorio, sector) {
    return 0.5; // Por implementar con APIs reales
  },
  describir: function(sector) {
    const descripciones = {
      educación: 'Formación, universidades, investigación académica',
      sanidad: 'Hospitales, salud pública, atención médica',
      energía: 'Producción y distribución de energía',
      infraestructuras: 'Carreteras, puertos, aeropuertos, telecomunicaciones',
      industria: 'Fabricación, producción industrial',
      comercio: 'Exportaciones, importaciones, mercados',
      tecnología: 'I+D, innovación, digitalización',
      agricultura: 'Cultivos, ganadería, pesca',
      medio_ambiente: 'Clima, biodiversidad, recursos naturales',
      defensa: 'Industria militar, seguridad'
    };
    return descripciones[sector] || 'Sector no definido';
  }
};

window.SECTORES = SECTORES;
