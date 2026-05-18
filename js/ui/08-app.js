// ============================================
// APP PRINCIPAL - Inicialización de todos los módulos
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Tablero Mundial v3.0 iniciando...');
  
  // Inicializar idioma primero
  if (window.Idioma) await Idioma.init();
  
  // Inicializar componentes UI
  if (window.MapaMundial) MapaMundial.init();
  if (window.UIPanelInfo) UIPanelInfo.init();
  if (window.UIVerificador) UIVerificador.init();
  if (window.UISimulador) UISimulador.init();
  if (window.UIDomino) UIDomino.init();
  if (window.UIRelaciones) UIRelaciones.init();
  if (window.UIRelacionesGlobales) UIRelacionesGlobales.init();
  if (window.UITimeline) UITimeline.init();
  
  // Configurar modos
  const btnModoReal = document.getElementById('btn-modo-real');
  const btnModoJuego = document.getElementById('btn-modo-juego');
  const modoBadge = document.getElementById('modo-badge');
  if (btnModoReal) {
    btnModoReal.addEventListener('click', () => {
      CONFIG.modo = 'realidad';
      btnModoReal.classList.add('active');
      if (btnModoJuego) btnModoJuego.classList.remove('active');
      if (modoBadge) {
        modoBadge.innerHTML = '🌐 MODO REAL';
        modoBadge.style.background = '#2e7d32';
      }
    });
  }
  if (btnModoJuego) {
    btnModoJuego.addEventListener('click', () => {
      CONFIG.modo = 'juego';
      btnModoJuego.classList.add('active');
      if (btnModoReal) btnModoReal.classList.remove('active');
      if (modoBadge) {
        modoBadge.innerHTML = '🎮 MODO JUEGO';
        modoBadge.style.background = '#b27c2c';
      }
    });
  }
  
  // Buscador rápido
  const buscador = document.getElementById('buscador-rapido');
  if (buscador) {
    buscador.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const busqueda = e.target.value.trim();
        if (busqueda && window.MapaMundial) {
          const resultados = TERRITORIOS.buscar(busqueda);
          if (resultados.length > 0) MapaMundial.irAPais(resultados[0].id);
        }
      }
    });
  }
  
  console.log('✅ Tablero Mundial listo');
});
