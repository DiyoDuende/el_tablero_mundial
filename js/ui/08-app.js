// ============================================
// 🌍 TABLERO MUNDIAL
// 08-app.js
// APP PRINCIPAL
// ============================================

document.addEventListener('DOMContentLoaded', async () => {

    console.log('🚀 Iniciando Tablero Mundial...');

    // ============================================
    // CONFIG
    // ============================================

    window.CONFIG = window.CONFIG || {};

    if (!window.CONFIG.modo) {
        window.CONFIG.modo = 'realidad';
    }

    // ============================================
    // IDIOMA
    // ============================================

    try {

        if (
            window.Idioma &&
            typeof Idioma.init === 'function'
        ) {

            await Idioma.init();

            console.log('🌐 Idioma iniciado');
        }

    } catch (error) {

        console.error(
            '❌ Error idioma:',
            error
        );
    }

    // ============================================
    // MAPA
    // ============================================

    try {

        if (
            window.MapaMundial &&
            typeof MapaMundial.init === 'function'
        ) {

            MapaMundial.init();

            console.log('🗺️ Mapa iniciado');
        }

    } catch (error) {

        console.error(
            '❌ Error mapa:',
            error
        );
    }

    // ============================================
    // UI
    // ============================================

    const componentes = [

        window.UIPanelInfo,
        window.UIVerificador,
        window.UISimulador,
        window.UIRelacionesGlobales,
        window.UITimeline
    ];

    componentes.forEach(comp => {

        try {

            if (
                comp &&
                typeof comp.init === 'function'
            ) {

                comp.init();
            }

        } catch (error) {

            console.error(
                '❌ Error iniciando UI:',
                error
            );
        }
    });

    // ============================================
    // BUSCADOR
    // ============================================

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
                    window.MapaMundial &&
                    typeof MapaMundial.buscarLugar === 'function'
                ) {

                    MapaMundial.buscarLugar(
                        valor
                    );
                }
            }
        );
    }

    // ============================================
    // CAPAS
    // ============================================

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
                window.MapaMundial &&
                typeof MapaMundial.activarCapa === 'function'
            ) {

                MapaMundial.activarCapa(
                    capa,
                    activa
                );
            }
        }
    );

    // ============================================
    // MODO REAL / JUEGO
    // ============================================

    const btnReal =
        document.getElementById(
            'btn-modo-real'
        );

    const btnJuego =
        document.getElementById(
            'btn-modo-juego'
        );

    const badge =
        document.getElementById(
            'modo-badge'
        );

    const simuladorPanel =
        document.getElementById(
            'simulador-panel'
        );

    if (btnReal) {

        btnReal.addEventListener(
            'click',
            () => {

                window.CONFIG.modo =
                    'realidad';

                btnReal.classList.add(
                    'active'
                );

                if (btnJuego) {

                    btnJuego.classList.remove(
                        'active'
                    );
                }

                if (badge) {

                    badge.textContent =
                        '🌐 MODO REAL';
                }

                if (simuladorPanel) {

                    simuladorPanel.classList.remove(
                        'active'
                    );
                }
            }
        );
    }

    if (btnJuego) {

        btnJuego.addEventListener(
            'click',
            () => {

                window.CONFIG.modo =
                    'juego';

                btnJuego.classList.add(
                    'active'
                );

                if (btnReal) {

                    btnReal.classList.remove(
                        'active'
                    );
                }

                if (badge) {

                    badge.textContent =
                        '🎮 MODO JUEGO';
                }

                if (simuladorPanel) {

                    simuladorPanel.classList.add(
                        'active'
                    );
                }
            }
        );
    }

    // ============================================
    // RESPONSIVE MAP
    // ============================================

    window.addEventListener(
        'resize',
        () => {

            if (
                window.MapaMundial &&
                MapaMundial.map
            ) {

                setTimeout(() => {

                    MapaMundial.map.invalidateSize();

                }, 200);
            }
        }
    );

    console.log(
        '✅ Tablero Mundial listo'
    );
});
