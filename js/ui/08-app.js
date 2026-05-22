// ============================================
// APP PRINCIPAL
// ============================================

document.addEventListener('DOMContentLoaded', async () => {

    console.log('🚀 Iniciando Tablero Mundial...');

    // ============================================
    // IDIOMA
    // ============================================

    if (window.Idioma && Idioma.init) {
        await Idioma.init();
    }

    // ============================================
    // MAPA
    // ============================================

    if (window.MapaMundial && MapaMundial.init) {
        MapaMundial.init();
    }

    // ============================================
    // COMPONENTES UI
    // ============================================

    if (window.UIPanelInfo && UIPanelInfo.init) {
        UIPanelInfo.init();
    }

    if (window.UIVerificador && UIVerificador.init) {
        UIVerificador.init();
    }

    if (window.UISimulador && UISimulador.init) {
        UISimulador.init();
    }

    if (window.UIRelacionesGlobales && UIRelacionesGlobales.init) {
        UIRelacionesGlobales.init();
    }

    if (window.UITimeline && UITimeline.init) {
        UITimeline.init();
    }

    // ============================================
    // MODOS REAL / JUEGO
    // ============================================

    const btnReal = document.getElementById('btn-modo-real');
    const btnJuego = document.getElementById('btn-modo-juego');
    const badge = document.getElementById('modo-badge');

    if (btnReal && btnJuego && badge) {

        btnReal.addEventListener('click', () => {

            window.CONFIG.modo = 'realidad';

            btnReal.classList.add('active');
            btnJuego.classList.remove('active');

            badge.textContent = '🌐 MODO REAL';

            console.log('🌐 Modo REAL activado');
        });

        btnJuego.addEventListener('click', () => {

            window.CONFIG.modo = 'juego';

            btnJuego.classList.add('active');
            btnReal.classList.remove('active');

            badge.textContent = '🎮 MODO JUEGO';

            console.log('🎮 Modo JUEGO activado');
        });
    }

    // ============================================
    // README Y NORMAS
    // ============================================

    const btnReadme = document.getElementById('btn-readme');
    const btnNormas = document.getElementById('btn-normas');

    const modalReadme = document.getElementById('modal-readme');
    const modalNormas = document.getElementById('modal-normas');

    const btnCerrarReadme = document.getElementById('btn-cerrar-readme');
    const btnCerrarNormas = document.getElementById('btn-cerrar-normas');

    const readmeContenido = document.getElementById('readme-contenido');
    const normasContenido = document.getElementById('normas-contenido');

    async function cargarMarkdown(url, elementoHtml) {

        try {

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const markdown = await response.text();

            let html = markdown
                .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                .replace(/^\* (.*$)/gim, '<li>$1</li>')
                .replace(/\n/g, '<br>');

            elementoHtml.innerHTML = html;

        } catch (error) {

            console.error(error);

            elementoHtml.innerHTML = `
                <p>❌ Error al cargar archivo</p>
                <p>${error.message}</p>
            `;
        }
    }

    // README
    if (btnReadme) {

        btnReadme.addEventListener('click', async () => {

            await cargarMarkdown(
                'Readme.md',
                readmeContenido
            );

            modalReadme.style.display = 'flex';
        });
    }

    // NORMAS
    if (btnNormas) {

        btnNormas.addEventListener('click', async () => {

            await cargarMarkdown(
                'Normas.md',
                normasContenido
            );

            modalNormas.style.display = 'flex';
        });
    }

    // Cerrar README
    if (btnCerrarReadme) {

        btnCerrarReadme.addEventListener('click', () => {
            modalReadme.style.display = 'none';
        });
    }

    // Cerrar Normas
    if (btnCerrarNormas) {

        btnCerrarNormas.addEventListener('click', () => {
            modalNormas.style.display = 'none';
        });
    }

    // ============================================
    // VERIFICADOR
    // ============================================

    const btnVerificador =
        document.getElementById('btn-verificador-panel');

    const verificadorPanel =
        document.getElementById('verificador-panel');

    const btnCerrarVerificador =
        document.getElementById('btn-cerrar-verificador');

    if (btnVerificador && verificadorPanel) {

        btnVerificador.addEventListener('click', () => {

            const visible =
                verificadorPanel.style.display === 'flex';

            verificadorPanel.style.display =
                visible ? 'none' : 'flex';
        });
    }

    if (btnCerrarVerificador && verificadorPanel) {

        btnCerrarVerificador.addEventListener('click', () => {

            verificadorPanel.style.display = 'none';
        });
    }

    // ============================================
    // INICIO
    // ============================================

    console.log('✅ Tablero Mundial listo');
});
