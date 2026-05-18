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
      const mapa = {
        ES: 'es', AR: 'es', MX: 'es', CO: 'es', PE: 'es',
        US: 'en', GB: 'en', AU: 'en', CA: 'en',
        FR: 'fr', BE: 'fr', CH: 'fr',
        BR: 'pt', PT: 'pt',
        DE: 'de', AT: 'de',
        CN: 'zh', TW: 'zh',
        SA: 'ar', AE: 'ar', EG: 'ar'
      };
      return mapa[data.country_code] || 'en';
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
    const topNav = document.querySelector('.top-nav');
    if (!topNav) return;
    if (document.getElementById('selector-idioma-universal')) return;

    const container = document.createElement('div');
    container.id = 'selector-idioma-universal';
    container.className = 'selector-idioma-universal';
    container.style.marginLeft = 'auto';
    container.style.marginRight = '10px';

    let selectHtml = `<select id="selector-idioma" class="idioma-select universal" style="background:#1c2c36; color:white; border-radius:30px; padding:6px 12px; border:1px solid #2a4050;">`;
    this.idiomas.forEach(idioma => {
      const selected = idioma.code === this.actual ? 'selected' : '';
      selectHtml += `<option value="${idioma.code}" ${selected}>${idioma.bandera} ${idioma.native}</option>`;
    });
    selectHtml += `</select>`;

    container.innerHTML = selectHtml;
    topNav.appendChild(container);

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
