// ============================================
// 🌍 TABLERO MUNDIAL
// 08-app.js
// APP PRINCIPAL ESTABLE V4
// ============================================

document.addEventListener(
    'DOMContentLoaded',
    async () => {

        console.log(
            '🚀 Iniciando Tablero Mundial...'
        );

        window.CONFIG =
            window.CONFIG || {};

        if (!window.CONFIG.modo) {

            window.CONFIG.modo =
                'realidad';
        }

        // MAPA

        if (
            window.MapaMundial
        ) {

            MapaMundial.init();
        }

        // UI

        [
            window.UIPanelInfo,
            window.UIVerificador,
            window.UISimulador,
            window.UIRelacionesGlobales,
            window.UITimeline
        ].forEach(modulo => {

            if (
                modulo &&
                typeof modulo.init ===
                    'function'
            ) {

                modulo.init();
            }
        });

        // MODOS

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

                    badge.textContent =
                        '🌐 MODO REAL';

                    btnReal.classList.add(
                        'active'
                    );

                    btnJuego.classList.remove(
                        'active'
                    );

                    simuladorPanel.classList.remove(
                        'active'
                    );
                }
            );
        }

        if (btnJuego) {

            btnJuego.addEventListener(
                'click',
                () => {

                    window.CONFIG.modo =
                        'juego';

                    badge.textContent =
                        '🎮 MODO JUEGO';

                    btnJuego.classList.add(
                        'active'
                    );

                    btnReal.classList.remove(
                        'active'
                    );

                    simuladorPanel.classList.add(
                        'active'
                    );
                }
            );
        }

        // BOTONES PANELES

        const paneles = [

            {
                btn:
                    'btn-verificador-panel',
                panel:
                    'verificador-panel'
            },

            {
                btn:
                    'btn-relaciones-globales',
                panel:
                    'relaciones-globales-panel'
            },

            {
                btn:
                    'btn-timeline-panel',
                panel:
                    'timeline-panel'
            }
        ];

        paneles.forEach(item => {

            const btn =
                document.getElementById(
                    item.btn
                );

            const panel =
                document.getElementById(
                    item.panel
                );

            if (btn && panel) {

                btn.addEventListener(
                    'click',
                    () => {

                        panel.classList.toggle(
                            'active'
                        );
                    }
                );
            }
        });

        // CERRAR

        document.addEventListener(
            'click',
            (e) => {

                const cerrar =
                    e.target.closest(
                        '.btn-cerrar'
                    );

                if (!cerrar) return;

                const panel =
                    cerrar.closest(
                        '.panel'
                    );

                if (panel) {

                    panel.classList.remove(
                        'active'
                    );
                }
            }
        );

        // BUSCADOR

        const buscador =
            document.getElementById(
                'buscador-rapido'
            );

        if (buscador) {

            buscador.addEventListener(
                'keydown',
                (e) => {

                    if (
                        e.key === 'Enter'
                    ) {

                        MapaMundial.buscarLugar(
                            buscador.value
                        );
                    }
                }
            );
        }

        // CAPAS

        document.addEventListener(
            'click',
            (e) => {

                const btn =
                    e.target.closest(
                        '.capa-icon'
                    );

                if (!btn) return;

                btn.classList.toggle(
                    'activo'
                );

                const capa =
                    btn.dataset.capa;

                const activa =
                    btn.classList.contains(
                        'activo'
                    );

                MapaMundial.activarCapa(
                    capa,
                    activa
                );
            }
        );

        console.log(
            '✅ Tablero Mundial listo'
        );
    }
);
