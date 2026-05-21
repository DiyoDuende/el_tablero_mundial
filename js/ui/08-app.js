// js/ui/08-app.js
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Iniciando Tablero Mundial...');

    if (window.Idioma && window.Idioma.init) await Idioma.init();

    // Inicializar componentes (el mapa se inicia solo en 00-mapa.js)
    if (window.MapaMundial && window.MapaMundial.init) MapaMundial.init();
    if (window.UIPanelInfo && window.UIPanelInfo.init) UIPanelInfo.init();
    if (window.UIVerificador && window.UIVerificador.init) UIVerificador.init();
    if (window.UISimulador && window.UISimulador.init) UISimulador.init();
    if (window.UIRelacionesGlobales && window.UIRelacionesGlobales.init) UIRelacionesGlobales.init();
    if (window.UITimeline && window.UITimeline.init) UITimeline.init();

    // Botones de modo
    const btnReal = document.getElementById('btn-modo-real');
    const btnJuego = document.getElementById('btn-modo-juego');
    const badge = document.getElementById('modo-badge');
    if (btnReal && btnJuego && badge) {
        btnReal.addEventListener('click', () => {
            window.CONFIG.modo = 'realidad';
            btnReal.classList.add('active');
            btnJuego.classList.remove('active');
            badge.textContent = '🌐 MODO REAL';
        });
        btnJuego.addEventListener('click', () => {
            window.CONFIG.modo = 'juego';
            btnJuego.classList.add('active');
            btnReal.classList.remove('active');
            badge.textContent = '🎮 MODO JUEGO';
        });
    }

    // Botones de README y NORMAS
const btnReadme = document.getElementById('btn-readme');
const btnNormas = document.getElementById('btn-normas');
const modalReadme = document.getElementById('modal-readme');
const modalNormas = document.getElementById('modal-normas');
const btnCerrarReadme = document.getElementById('btn-cerrar-readme');
const btnCerrarNormas = document.getElementById('btn-cerrar-normas');
const readmeContenido = document.getElementById('readme-contenido');
const normasContenido = document.getElementById('normas-contenido');

async function cargarMarkdown(url, elementoHtml) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const markdown = await response.text();
        // Convertir markdown a HTML de forma muy básica
        let html = markdown
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/^## (.*$)/gim, '<h2>$2</h2>')
            .replace(/^\* (.*$)/gim, '<li>$1</li>')
            .replace(/<\/li>\n<li>/g, '</li><li>')
            .replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>')
            .replace(/\n/g, '<br>');
        elementoHtml.innerHTML = html;
    } catch (error) {
        elementoHtml.innerHTML = `<p>Error al cargar el archivo: ${error.message}</p>`;
    }
}

if (btnReadme) {
    btnReadme.addEventListener('click', async () => {
        await cargarMarkdown('Readme.md', readmeContenido);
        modalReadme.style.display = 'flex';
    });
}
if (btnNormas) {
    btnNormas.addEventListener('click', async () => {
        await cargarMarkdown('Normas.md', normasContenido);
        modalNormas.style.display = 'flex';
    });
}
// ... (el código de cierre de los modales sigue igual)

    // Botón de verificador
    const btnVerificador = document.getElementById('btn-verificador-panel');
    const verificadorPanel = document.getElementById('verificador-panel');
    const btnCerrarVerificador = document.getElementById('btn-cerrar-verificador');

    if (btnVerificador && verificadorPanel) {
        btnVerificador.addEventListener('click', () => {
            verificadorPanel.style.display = verificadorPanel.style.display === 'none' ? 'flex' : 'none';
        });
    }

    if (btnCerrarVerificador && verificadorPanel) {
        btnCerrarVerificador.addEventListener('click', () => {
            verificadorPanel.style.display = 'none';
        });
    }

    // Botón de simulación
    const btnModoJuego = document.getElementById('btn-modo-juego');
const btnModoReal = document.getElementById('btn-modo-real');
const badge = document.getElementById('modo-badge');
const simuladorPanel = document.getElementById('simulador-panel');

if (btnModoJuego && btnModoReal && badge && simuladorPanel) {
    btnModoReal.addEventListener('click', () => {
        window.CONFIG.modo = 'realidad';
        btnModoReal.classList.add('active');
        btnModoJuego.classList.remove('active');
        badge.textContent = '🌐 MODO REAL';
        simuladorPanel.style.display = 'none';  // oculta el panel
    });
    
    btnModoJuego.addEventListener('click', () => {
        window.CONFIG.modo = 'juego';
        btnModoJuego.classList.add('active');
        btnModoReal.classList.remove('active');
        badge.textContent = '🎮 MODO JUEGO';
        simuladorPanel.style.display = 'flex';  // muestra el panel
    });
}

