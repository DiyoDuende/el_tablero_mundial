const Idioma = {
    actual: 'es',
    textos: {},
    async init() {
        const lang = (navigator.language || 'en').slice(0,2);
        this.actual = ['es','en'].includes(lang) ? lang : 'en';
        await this.cargar(this.actual);
        this.aplicar();
    },
    async cargar(codigo) {
        const res = await fetch(`lang/${codigo}.json`);
        this.textos = await res.json();
    },
    aplicar() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (this.textos[key]) el.textContent = this.textos[key];
        });
    }
};
window.Idioma = Idioma;
