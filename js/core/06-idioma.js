// ============================================
// IDIOMA UNIVERSAL - Detección y traducción global (sin Google Translate)
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
    const idiomaNavegador = (navigator.language || 'en').slice(0,2).toLowerCase();
    if (this.disponibles.includes(idiomaNavegador)) this.actual = idiomaNavegador;
    await this.cargarTextos(this.actual);
    this.aplicarIdioma();
    this.crearSelector();
  },

  cargarTextos: async function(codigo) {
    try {
      const res = await fetch(`lang/${codigo}.json`);
      if (res.ok) this.textos = await res.json();
      else {
        const fallback = await fetch('lang/en.json');
        this.textos = await fallback.json();
      }
    } catch {
      this.textos = { titulo: 'WORLD BOARD' };
    }
  },

  aplicarIdioma: function() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (this.textos[key]) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = this.textos[key];
        else el.textContent = this.textos[key];
      }
    });
  },

  crearSelector: function() {
    const topNav = document.querySelector('.top-nav');
    if (!topNav || document.getElementById('selector-idioma-universal')) return;
    const container = document.createElement('div');
    container.id = 'selector-idioma-universal';
    container.className = 'selector-idioma-universal';
    container.style.marginLeft = 'auto';
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
  }
};

window.Idioma = Idioma;
