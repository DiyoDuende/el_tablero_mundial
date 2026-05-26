// ============================================
// 🌍 TABLERO MUNDIAL
// 08-app.js
// APP PRINCIPAL LIMPIA Y ESTABLE
// ============================================

document.addEventListener('DOMContentLoaded', async () => {

    console.log('🚀 Iniciando Tablero Mundial...');

    // =====================================================
    // CONFIG GLOBAL
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
    // FUNCIÓN CERRAR TODO
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

            if (simuladorPanel)
                simuladorPanel.classList.remove('active');
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

            if (simuladorPanel)
                simuladorPanel.classList.add('active');
        });
    }

    // =====================================================
    // VERIFICADOR
    // =====================================================

    const btnVerificador =
        document.getElementById(
            'btn-verificador-panel'
        );

    const btnCerrarVerificador =
        document.getElementById(
            'btn-cerrar-verificador'
        );

    if (btnVerificador && verificadorPanel) {

        btnVerificador.addEventListener('click', () => {

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
        });
    }

    if (
        btnCerrarVerificador &&
        verificadorPanel
    ) {

        btnCerrarVerificador.addEventListener(
            'click',
            () => {

                verificadorPanel.classList.remove(
                    'active'
                );
            }
        );
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

    if (
        btnCerrarRelaciones &&
        relacionesPanel
    ) {

        btnCerrarRelaciones.addEventListener(
            'click',
            () => {

                relacionesPanel.classList.remove(
                    'active'
                );
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

    const btnCerrarTimeline =
        document.getElementById(
            'btn-cerrar-timeline'
        );

    if (btnTimeline && timelinePanel) {

        btnTimeline.addEventListener('click', () => {

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
        });
    }

    if (
        btnCerrarTimeline &&
        timelinePanel
    ) {

        btnCerrarTimeline.addEventListener(
            'click',
            () => {

                timelinePanel.classList.remove(
                    'active'
                );
            }
        );
    }

    // ============================================
// README / NORMAS
// ============================================

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

const btnCerrarReadme =
    document.getElementById(
        'btn-cerrar-readme'
    );

const btnCerrarNormas =
    document.getElementById(
        'btn-cerrar-normas'
    );

const readmeContenido =
    document.getElementById(
        'readme-contenido'
    );

const normasContenido =
    document.getElementById(
        'normas-contenido'
    );

async function cargarMarkdown(
    url,
    destino
) {

    try {

        const response =
            await fetch(url);

        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );
        }

        const markdown =
            await response.text();

        let html = markdown

            .replace(
                /^### (.*$)/gim,
                '<h3>$1</h3>'
            )

            .replace(
                /^## (.*$)/gim,
                '<h2>$1</h2>'
            )

            .replace(
                /^# (.*$)/gim,
                '<h1>$1</h1>'
            )

            .replace(
                /\*\*(.*?)\*\*/gim,
                '<strong>$1</strong>'
            )

            .replace(
                /\n/g,
                '<br>'
            );

        destino.innerHTML = html;

    } catch (error) {

        console.error(error);

        destino.innerHTML = `
            <h3>
                ❌ Error cargando archivo
            </h3>

            <p>
                ${error.message}
            </p>
        `;
    }
}

// README

if (
    btnReadme &&
    modalReadme
) {

    btnReadme.addEventListener(
        'click',
        async () => {

            await cargarMarkdown(
                'Readme.md',
                readmeContenido
            );

            modalReadme.style.display =
                'flex';
        }
    );
}

// NORMAS

if (
    btnNormas &&
    modalNormas
) {

    btnNormas.addEventListener(
        'click',
        async () => {

            await cargarMarkdown(
                'Normas.md',
                normasContenido
            );

            modalNormas.style.display =
                'flex';
        }
    );
}

// CERRAR README

if (
    btnCerrarReadme &&
    modalReadme
) {

    btnCerrarReadme.addEventListener(
        'click',
        () => {

            modalReadme.style.display =
                'none';
        }
    );
}

// CERRAR NORMAS

if (
    btnCerrarNormas &&
    modalNormas
) {

    btnCerrarNormas.addEventListener(
        'click',
        () => {

            modalNormas.style.display =
                'none';
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

                if (e.key !== 'Enter') return;

                const valor =
                    buscador.value.trim();

                if (!valor) return;

                if (
                    window.MapaMundial?.buscarLugar
                ) {

                    MapaMundial.buscarLugar(valor);
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

    console.log('✅ Tablero Mundial listo');
});
