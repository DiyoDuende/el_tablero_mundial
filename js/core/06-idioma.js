// ============================================
// IDIOMA UNIVERSAL - Detección y traducción global
// ============================================

const Idioma = {
    actual: 'es',
    textos: {},
    async init() {
        const idiomaNavegador = (navigator.language || 'en').slice(0, 2);
        this.actual = ['es', 'en'].includes(idiomaNavegador) ? idiomaNavegador : 'en';
        await this.cargarTextos(this.actual);
        this.aplicarIdioma();
        this.crearSelector();
    },
    async cargarTextos(codigo) {
        const respuesta = await fetch(lang/${codigo}.json);
        this.textos = await respuesta.json();
    },
    aplicarIdioma() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const clave = el.dataset.i18n;
            if (this.textos[clave]) {
                if (el.tagName === 'INPUT') el.placeholder = this.textos[clave];
                else el.textContent = this.textos[clave];
            }
        });
    },
    // ... (código para crear el selector de idioma en la interfaz)
};
window.Idioma = Idioma;
