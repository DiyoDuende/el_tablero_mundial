// js/ui/08-app.js
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Iniciando Tablero Mundial...');

    if (window.Idioma && window.Idioma.init) await Idioma.init();

    // Inicializar componentes (el mapa se inicia solo en 00-mapa.js)
    if (window.MapaMundial && window.MapaMundial.init) MapaMundial.init();
    if (window.UIPanelInfo && window.UIPanelInfo.init) UIPanelInfo.init();
    if (window.UIVerificador && window.UIVerificador.init) UIVerificador.init();
    if (window.UISimulador && window.UISimulador.init) UISimulador.init();
    if (window.UIRelacionesGlobales && window.UIRelacionesGlobales.init) UIRelacionesGlobales.init();
    if (window.UITimeline && window.UITimeline.init) UITimeline.init();

    // Botones de modo
    const btnReal = document.getElementById('btn-modo-real');
    const btnJuego = document.getElementById('btn-modo-juego');
    const badge = document.getElementById('modo-badge');
    if (btnReal && btnJuego && badge) {
        btnReal.addEventListener('click', () => {
            window.CONFIG.modo = 'realidad';
            btnReal.classList.add('active');
            btnJuego.classList.remove('active');
            badge.textContent = '🌐 MODO REAL';
        });
        btnJuego.addEventListener('click', () => {
            window.CONFIG.modo = 'juego';
            btnJuego.classList.add('active');
            btnReal.classList.remove('active');
            badge.textContent = '🎮 MODO JUEGO';
        });
    }

    // Botones de README y NORMAS
    const btnReadme = document.getElementById('btn-readme');
    const btnNormas = document.getElementById('btn-normas');
    const modalReadme = document.getElementById('modal-readme');
    const modalNormas = document.getElementById('modal-normas');
    const btnCerrarReadme = document.getElementById('btn-cerrar-readme');
    const btnCerrarNormas = document.getElementById('btn-cerrar-normas');
    const readmeContenido = document.getElementById('readme-contenido');
    const normasContenido = document.getElementById('normas-contenido');

    if (btnReadme) {
        btnReadme.addEventListener('click', async () => {
            try {
                const response = await fetch('Readme.md');   // ✅ CORREGIDO: Readme.md con 'e' minúscula
                const markdown = await response.text();
                readmeContenido.innerHTML = markdown.replace(/^# /gm, '<h1>').replace(/\n/g, '<br>');
                modalReadme.style.display = 'flex';
            } catch (e) {
                readmeContenido.innerHTML = '<p>Error al cargar README</p>';
                modalReadme.style.display = 'flex';
            }
        });
    }

    if (btnNormas) {
        btnNormas.addEventListener('click', async () => {
            try {
                const response = await fetch('Normas.md');
                const markdown = await response.text();
                normasContenido.innerHTML = markdown.replace(/^# /gm, '<h1>').replace(/\n/g, '<br>');
                modalNormas.style.display = 'flex';
            } catch (e) {
                normasContenido.innerHTML = '<p>Error al cargar Normas</p>';
                modalNormas.style.display = 'flex';
            }
        });
    }

    if (btnCerrarReadme) {
        btnCerrarReadme.addEventListener('click', () => {
            modalReadme.style.display = 'none';
        });
    }

    if (btnCerrarNormas) {
        btnCerrarNormas.addEventListener('click', () => {
            modalNormas.style.display = 'none';
        });
    }

    // Cerrar modales al hacer clic en overlay
    if (modalReadme) {
        modalReadme.addEventListener('click', (e) => {
            if (e.target === modalReadme) modalReadme.style.display = 'none';
        });
    }

    if (modalNormas) {
        modalNormas.addEventListener('click', (e) => {
            if (e.target === modalNormas) modalNormas.style.display = 'none';
        });
    }

    // Botón de verificador
    const btnVerificador = document.getElementById('btn-verificador-panel');
    const verificadorPanel = document.getElementById('verificador-panel');
    const btnCerrarVerificador = document.getElementById('btn-cerrar-verificador');

    if (btnVerificador && verificadorPanel) {
        btnVerificador.addEventListener('click', () => {
            verificadorPanel.style.display = verificadorPanel.style.display === 'none' ? 'flex' : 'none';
        });
    }

    if (btnCerrarVerificador && verificadorPanel) {
        btnCerrarVerificador.addEventListener('click', () => {
            verificadorPanel.style.display = 'none';
        });
    }

    // Botón de simulación
    const btnModoJuego = document.getElementById('btn-modo-juego');
    const simuladorPanel = document.getElementById('simulador-panel');

    if (btnModoJuego && simuladorPanel) {
        btnModoJuego.addEventListener('click', () => {
            if (simuladorPanel.style.display !== 'flex') {
                simuladorPanel.style.display = 'flex';
            }
        });
    }

    if (window.UIPanelInfo && window.UIPanelInfo.mostrarPais) UIPanelInfo.mostrarPais('españa');
    console.log('✅ Tablero Mundial listo');
});

