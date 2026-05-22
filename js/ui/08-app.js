// ============================================
// 🌍 TABLERO MUNDIAL
// 08-app.js
// APP PRINCIPAL COMPLETA Y CORREGIDA
// ============================================

document.addEventListener('DOMContentLoaded', async () => {

    console.log('🚀 Iniciando Tablero Mundial...');

    // =====================================================
    // CONFIG GLOBAL SEGURA
    // =====================================================

    window.CONFIG = window.CONFIG || {};

    if (!window.CONFIG.modo) {
        window.CONFIG.modo = 'realidad';
    }

    // =====================================================
    // INICIALIZAR IDIOMA
    // =====================================================

    try {

        if (window.Idioma && typeof Idioma.init === 'function') {
            await Idioma.init();
            console.log('🌐 Idioma iniciado');
        }

    } catch (error) {

        console.error('❌ Error iniciando idioma:', error);
    }

    // =====================================================
    // INICIALIZAR MAPA
    // =====================================================

    try {

        if (window.MapaMundial && typeof MapaMundial.init === 'function') {

            MapaMundial.init();

            console.log('🗺️ Mapa iniciado');
        }

    } catch (error) {

        console.error('❌ Error iniciando mapa:', error);
    }

    // =====================================================
    // INICIALIZAR UI
    // =====================================================

    const componentes = [

        {
            nombre: 'UIPanelInfo',
            objeto: window.UIPanelInfo
        },

        {
            nombre: 'UIVerificador',
            objeto: window.UIVerificador
        },

        {
            nombre: 'UISimulador',
            objeto: window.UISimulador
        },

        {
            nombre: 'UIRelacionesGlobales',
            objeto: window.UIRelacionesGlobales
        },

        {
            nombre: 'UITimeline',
            objeto: window.UITimeline
        }
    ];

    componentes.forEach(componente => {

        try {

            if (
                componente.objeto &&
                typeof componente.objeto.init === 'function'
            ) {

                componente.objeto.init();

                console.log(`✅ ${componente.nombre} iniciado`);
            }

        } catch (error) {

            console.error(
                `❌ Error iniciando ${componente.nombre}:`,
                error
            );
        }
    });

    // =====================================================
    // ELEMENTOS DOM
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
        document.getElementById('relaciones-globales-panel');

    const timelinePanel =
        document.getElementById('timeline-panel');

    // =====================================================
    // FUNCIÓN CERRAR TODOS LOS PANELES
    // =====================================================

    function cerrarTodosLosPaneles() {

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

            if (btnJuego) {
                btnJuego.classList.remove('active');
            }

            if (badge) {
                badge.textContent = '🌐 MODO REAL';
            }

            if (simuladorPanel) {
                simuladorPanel.classList.remove('active');
            }

            console.log('🌐 Modo REAL activado');
        });
    }

    // =====================================================
    // MODO JUEGO
    // =====================================================

    if (btnJuego) {

        btnJuego.addEventListener('click', () => {

            window.CONFIG.modo = 'juego';

            btnJuego.classList.add('active');

            if (btnReal) {
                btnReal.classList.remove('active');
            }

            if (badge) {
                badge.textContent = '🎮 MODO JUEGO';
            }

            if (simuladorPanel) {
                simuladorPanel.classList.add('active');
            }

            console.log('🎮 Modo JUEGO activado');
        });
    }

    // =====================================================
    // VERIFICADOR
    // =====================================================

    const btnVerificador =
        document.getElementById('btn-verificador-panel');

    const btnCerrarVerificador =
        document.getElementById('btn-cerrar-verificador');

    if (btnVerificador && verificadorPanel) {

        btnVerificador.addEventListener('click', () => {

            const abierto =
                verificadorPanel.classList.contains('active');

            cerrarTodosLosPaneles();

            if (!abierto) {
                verificadorPanel.classList.add('active');
            }
        });
    }

    if (btnCerrarVerificador && verificadorPanel) {

        btnCerrarVerificador.addEventListener('click', () => {

            verificadorPanel.classList.remove('active');
        });
    }

    // =====================================================
    // RELACIONES GLOBALES
    // =====================================================

    const btnRelaciones =
        document.getElementById(
            'btn-relaciones-globales'
        );

    const btnCerrarRelaciones =
        document.getElementById(
            'btn-cerrar-relaciones-globales'
        );

    if (btnRelaciones && relacionesPanel) {

        btnRelaciones.addEventListener('click', () => {

            const abierto =
                relacionesPanel.classList.contains('active');

            cerrarTodosLosPaneles();

            if (!abierto) {

                relacionesPanel.classList.add('active');

                if (
                    window.UIRelacionesGlobales &&
                    typeof UIRelacionesGlobales.render === 'function'
                ) {

                    UIRelacionesGlobales.render();
                }
            }
        });
    }

    if (btnCerrarRelaciones && relacionesPanel) {

        btnCerrarRelaciones.addEventListener('click', () => {

            relacionesPanel.classList.remove('active');
        });
    }

    // =====================================================
    // TIMELINE
    // =====================================================

    const btnTimeline =
        document.getElementById('btn-timeline-panel');

    const btnCerrarTimeline =
        document.getElementById('btn-cerrar-timeline');

    if (btnTimeline && timelinePanel) {

        btnTimeline.addEventListener('click', () => {

            const abierto =
                timelinePanel.classList.contains('active');

            cerrarTodosLosPaneles();

            if (!abierto) {

                timelinePanel.classList.add('active');

                if (
                    window.UITimeline &&
                    typeof UITimeline.render === 'function'
                ) {

                    UITimeline.render();
                }
            }
        });
    }

    if (btnCerrarTimeline && timelinePanel) {

        btnCerrarTimeline.addEventListener('click', () => {

            timelinePanel.classList.remove('active');
        });
    }

    // =====================================================
    // README / NORMAS
    // =====================================================

    const btnReadme =
        document.getElementById('btn-readme');

    const btnNormas =
        document.getElementById('btn-normas');

    const modalReadme =
        document.getElementById('modal-readme');

    const modalNormas =
        document.getElementById('modal-normas');

    const btnCerrarReadme =
        document.getElementById('btn-cerrar-readme');

    const btnCerrarNormas =
        document.getElementById('btn-cerrar-normas');

    const readmeContenido =
        document.getElementById('readme-contenido');

    const normasContenido =
        document.getElementById('normas-contenido');

    async function cargarMarkdown(url, destino) {

        try {

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(
                    `HTTP ${response.status}`
                );
            }

            const markdown = await response.text();

            let html = markdown
                .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
                .replace(/\n/g, '<br>');

            destino.innerHTML = html;

        } catch (error) {

            console.error(error);

            destino.innerHTML = `
                <h3>❌ Error cargando archivo</h3>
                <p>${error.message}</p>
            `;
        }
    }

    // README

    if (btnReadme && modalReadme) {

        btnReadme.addEventListener('click', async () => {

            await cargarMarkdown(
                'Readme.md',
                readmeContenido
            );

            modalReadme.style.display = 'flex';
        });
    }

    // NORMAS

    if (btnNormas && modalNormas) {

        btnNormas.addEventListener('click', async () => {

            await cargarMarkdown(
                'Normas.md',
                normasContenido
            );

            modalNormas.style.display = 'flex';
        });
    }

    // CERRAR MODALES

    if (btnCerrarReadme && modalReadme) {

        btnCerrarReadme.addEventListener('click', () => {

            modalReadme.style.display = 'none';
        });
    }

    if (btnCerrarNormas && modalNormas) {

        btnCerrarNormas.addEventListener('click', () => {

            modalNormas.style.display = 'none';
        });
    }

    // CERRAR CLICK OVERLAY

    [modalReadme, modalNormas].forEach(modal => {

        if (!modal) return;

        modal.addEventListener('click', (e) => {

            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });

    // =====================================================
    // BUSCADOR RÁPIDO
    // =====================================================

    const buscador =
        document.getElementById('buscador-rapido');

    if (buscador) {

        buscador.addEventListener('keydown', (e) => {

            if (e.key !== 'Enter') return;

            const valor =
                buscador.value.trim().toLowerCase();

            if (!valor) return;

            if (
                window.MapaMundial &&
                typeof MapaMundial.irAPais === 'function'
            ) {

                MapaMundial.irAPais(valor);
            }
        });
    }

    // =====================================================
    // CAPAS
    // =====================================================

    const capas =
        document.querySelectorAll('.capa-icon');

    capas.forEach(btn => {

        btn.addEventListener('click', () => {

            btn.classList.toggle('activo');

            const capa =
                btn.dataset.capa;

            const activa =
                btn.classList.contains('activo');

            if (
                window.MapaMundial &&
                typeof MapaMundial.activarCapa === 'function'
            ) {

                MapaMundial.activarCapa(
                    capa,
                    activa
                );
            }
        });
    });

    // =====================================================
    // INVALIDAR TAMAÑO MAPA
    // =====================================================

    window.addEventListener('resize', () => {

        if (
            window.MapaMundial &&
            MapaMundial.map
        ) {

            setTimeout(() => {

                MapaMundial.map.invalidateSize();

            }, 200);
        }
    });

    // =====================================================
    // FIN
    // =====================================================

    console.log('✅ Tablero Mundial listo');
});
