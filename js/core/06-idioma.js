// ============================================
// IDIOMA UNIVERSAL - Detección y traducción global
// ============================================

const Idioma = {
    
    actual: 'es',
    disponibles: ['es', 'en', 'fr', 'pt', 'de', 'zh', 'ar'],
    
    idiomas: [
        { code: 'es', nombre: 'Español', native: 'Español', bandera: '🇪🇸' },
        { code: 'en', nombre: 'English', native: 'English', bandera: '🇬🇧' },
        { code: 'fr', nombre: 'Français', native: 'Français', bandera: '🇫🇷' },
        { code: 'pt', nombre: 'Português', native: 'Português', bandera: '🇧🇷' },
        { code: 'de', nombre: 'Deutsch', native: 'Deutsch', bandera: '🇩🇪' },
        { code: 'zh', nombre: '中文', native: '中文', bandera: '🇨🇳' },
        { code: 'ar', nombre: 'العربية', native: 'العربية', bandera: '🇸🇦' }
    ],
    
    mapaPaises: {
        ES: 'es', AR: 'es', MX: 'es', CO: 'es', PE: 'es', 
        US: 'en', GB: 'en', AU: 'en', CA: 'en',
        FR: 'fr', BE: 'fr', CH: 'fr',
        BR: 'pt', PT: 'pt',
        DE: 'de', AT: 'de',
        CN: 'zh', TW: 'zh',
        SA: 'ar', AE: 'ar', EG: 'ar'
    },
    
    textos: {},
    
    init: async function() {
        const idiomaNavegador = this.getIdiomaNavegador();
        
        if (this.disponibles.includes(idiomaNavegador)) {
            this.actual = idiomaNavegador;
        } else {
            await this.detectarPorPais().then(idioma => {
                if (idioma && this.disponibles.includes(idioma)) {
                    this.actual = idioma;
                }
            });
        }
        
        await this.cargarTextos(this.actual);
        this.aplicarIdioma();
        this.crearSelector();
    },
    
    getIdiomaNavegador: function() {
        return (navigator.language || 'en').slice(0, 2).toLowerCase();
    },
    
    detectarPorPais: async function() {
        try {
            const response = await fetch(CONFIG.apis.ipapi);
            const data = await response.json();
            return this.mapaPaises[data.country_code] || 'en';
        } catch {
            return 'en';
        }
    },
    
    cargarTextos: async function(codigo) {
        try {
            const response = await fetch(`lang/${codigo}.json`);
            if (response.ok) {
                this.textos = await response.json();
            } else {
                const fallback = await fetch('lang/en.json');
                this.textos = await fallback.json();
            }
        } catch {
            // Textos mínimos por defecto
            this.textos = {
                titulo: 'WORLD BOARD',
                documentacion: 'Documentation',
                datosReales: 'Real data',
                simulacion: 'Simulation',
                verificador: 'Verifier',
                buscar: 'Search country, city...'
            };
        }
    },
    
    aplicarIdioma: function() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (this.textos[key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = this.textos[key];
                } else {
                    el.textContent = this.textos[key];
                }
            }
        });
    },
    
    crearSelector: function() {
        const selector = document.createElement('div');
        selector.className = 'selector-idioma-universal';
        
        let opciones = '';
        this.idiomas.forEach(idioma => {
            const selected = idioma.code === this.actual ? 'selected' : '';
            opciones += `<option value="${idioma.code}" ${selected}>${idioma.bandera} ${idioma.native}</option>`;
        });
        
        selector.innerHTML = `
            <select id="selector-idioma" class="idioma-select universal">
                ${opciones}
            </select>
        `;
        
        const topNav = document.querySelector('.top-nav');
        topNav.insertBefore(selector, topNav.firstChild);
        
        document.getElementById('selector-idioma').addEventListener('change', async (e) => {
            this.actual = e.target.value;
            await this.cargarTextos(this.actual);
            this.aplicarIdioma();
        });
    },
    
    t: function(clave) {
        return this.textos[clave] || clave;
    }
};

window.Idioma = Idioma;
