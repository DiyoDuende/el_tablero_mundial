// ============================================
// 🌍 TABLERO MUNDIAL
// 08-app.js
// ============================================

document.addEventListener('DOMContentLoaded', async () => {

    console.log('🚀 Iniciando Tablero Mundial...');

    // =====================================================
    // CONFIG
    // =====================================================

    window.CONFIG = window.CONFIG || {};
    window.CONFIG.modo =
        window.CONFIG.modo || 'realidad';

    // =====================================================
    // INICIALIZAR MÓDULOS
    // =====================================================

    try {

        if (window.Idioma?.init)
            await Idioma.init();

        if (window.MapaMundial?.init)
            MapaMundial.init();

        if (window.UIPanelInfo?.init)
            UIPanelInfo.init();

        if (window.UIVerificador?.init)
            UIVerificador.init();

        if (window.UISimulador?.init)
            UISimulador.init();

        if (window.UIRelacionesGlobales?.init)
            UIRelacionesGlobales.init();

        if (window.UITimeline?.init)
            UITimeline.init();

    } catch (error) {

        console.error(error);
    }

    // =====================================================
    // ELEMENTOS
    // =====================================================

    const btnReal =
        document.getElementById('btn-modo-real');

    const btnJuego =
        document.getElementById('btn-modo-juego');

    const badge =
        document.getElementById('modo-badge');

    const simuladorPanel =
        document.getElementById('simulador-panel');

    const verificadorPanel =
        document.getElementById('verificador-panel');

    const relacionesPanel =
        document.getElementById(
            'relaciones-globales-panel'
        );

    const timelinePanel =
        document.getElementById('timeline-panel');

    // =====================================================
    // CERRAR TODOS
    // =====================================================

    function cerrarPaneles() {

        [
            simuladorPanel,
            verificadorPanel,
            relacionesPanel,
            timelinePanel
        ].forEach(panel => {

            if (panel) {

                panel.classList.remove('active');
            }
        });
    }

    // =====================================================
    // MODO REAL
    // =====================================================

    if (btnReal) {

        btnReal.addEventListener('click', () => {

            window.CONFIG.modo = 'realidad';

            btnReal.classList.add('active');

            if (btnJuego)
                btnJuego.classList.remove('active');

            if (badge)
                badge.textContent =
                    '🌐 MODO REAL';

            cerrarPaneles();
        });
    }

    // =====================================================
    // MODO JUEGO
    // =====================================================

    if (btnJuego) {

        btnJuego.addEventListener('click', () => {

            window.CONFIG.modo = 'juego';

            btnJuego.classList.add('active');

            if (btnReal)
                btnReal.classList.remove('active');

            if (badge)
                badge.textContent =
                    '🎮 MODO JUEGO';

            cerrarPaneles();

            if (simuladorPanel) {

                simuladorPanel.classList.add(
                    'active'
                );
            }
        });
    }

    // =====================================================
    // VERIFICADOR
    // =====================================================

    const btnVerificador =
        document.getElementById(
            'btn-verificador-panel'
        );

    if (
        btnVerificador &&
        verificadorPanel
    ) {

        btnVerificador.addEventListener(
            'click',
            () => {

                const abierto =
                    verificadorPanel.classList.contains(
                        'active'
                    );

                cerrarPaneles();

                if (!abierto) {

                    verificadorPanel.classList.add(
                        'active'
                    );
                }
            }
        );
    }

    // =====================================================
    // RELACIONES
    // =====================================================

    const btnRelaciones =
        document.getElementById(
            'btn-relaciones-globales'
        );

    if (
        btnRelaciones &&
        relacionesPanel
    ) {

        btnRelaciones.addEventListener(
            'click',
            () => {

                const abierto =
                    relacionesPanel.classList.contains(
                        'active'
                    );

                cerrarPaneles();

                if (!abierto) {

                    relacionesPanel.classList.add(
                        'active'
                    );
                }
            }
        );
    }

    // =====================================================
    // TIMELINE
    // =====================================================

    const btnTimeline =
        document.getElementById(
            'btn-timeline-panel'
        );

    if (
        btnTimeline &&
        timelinePanel
    ) {

        btnTimeline.addEventListener(
            'click',
            () => {

                const abierto =
                    timelinePanel.classList.contains(
                        'active'
                    );

                cerrarPaneles();

                if (!abierto) {

                    timelinePanel.classList.add(
                        'active'
                    );
                }
            }
        );
    }

    // =====================================================
    // README / NORMAS
    // =====================================================

    async function cargarMarkdown(
        url,
        destino
    ) {

        try {

            const response =
                await fetch(url);

            const markdown =
                await response.text();

            destino.innerHTML = `
                <pre style="
                    white-space: pre-wrap;
                    font-family: inherit;
                    line-height: 1.6;
                ">${markdown}</pre>
            `;

        } catch (error) {

            console.error(error);

            destino.innerHTML =
                '<p>Error cargando archivo</p>';
        }
    }

    const btnReadme =
        document.getElementById(
            'btn-readme'
        );

    const btnNormas =
        document.getElementById(
            'btn-normas'
        );

    const modalReadme =
        document.getElementById(
            'modal-readme'
        );

    const modalNormas =
        document.getElementById(
            'modal-normas'
        );

    const readmeContenido =
        document.getElementById(
            'readme-contenido'
        );

    const normasContenido =
        document.getElementById(
            'normas-contenido'
        );

    if (btnReadme && modalReadme) {

        btnReadme.addEventListener(
            'click',
            async () => {

                await cargarMarkdown(
                    'README.md',
                    readmeContenido
                );

                modalReadme.style.display =
                    'flex';
            }
        );
    }

    if (btnNormas && modalNormas) {

        btnNormas.addEventListener(
            'click',
            async () => {

                await cargarMarkdown(
                    'NORMAS.md',
                    normasContenido
                );

                modalNormas.style.display =
                    'flex';
            }
        );
    }

    // =====================================================
    // BUSCADOR
    // =====================================================

    const buscador =
        document.getElementById(
            'buscador-rapido'
        );

    if (buscador) {

        buscador.addEventListener(
            'keydown',
            (e) => {

                if (e.key !== 'Enter')
                    return;

                const valor =
                    buscador.value.trim();

                if (!valor)
                    return;

                if (
                    window.MapaMundial?.buscarLugar
                ) {

                    MapaMundial.buscarLugar(
                        valor
                    );
                }
            }
        );
    }

    // =====================================================
    // CAPAS
    // =====================================================

    document.addEventListener(
        'click',
        (e) => {

            const btn =
                e.target.closest('.capa-icon');

            if (!btn) return;

            btn.classList.toggle('activo');

            const capa =
                btn.dataset.capa;

            const activa =
                btn.classList.contains(
                    'activo'
                );

            if (
                window.MapaMundial?.activarCapa
            ) {

                MapaMundial.activarCapa(
                    capa,
                    activa
                );
            }
        }
    );

    console.log(
        '✅ Tablero Mundial listo'
    );
});
