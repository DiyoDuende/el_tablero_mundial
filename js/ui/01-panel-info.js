// ============================================================
// PANEL DE INFORMACIÓN DEL PAÍS (VERSIÓN CON DATOS REALES)
// ============================================================
const UIPanelInfo = {
    datosActuales: {},

    init: function() {
        document.querySelectorAll('.info-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const seccion = e.target.dataset.seccion;
                this.mostrarSeccion(seccion);
            });
        });
    },

    mostrarPais: function(code, nombrePais) {
        const datos = (window.MapaMundial && MapaMundial.datosPaises[code]) || {};
        this.datosActuales = datos;
        const nombre = nombrePais || code;

        document.getElementById('pais-nombre').innerHTML = `🌍 ${nombre}`;

        let estado = 'DESCONOCIDO';
        let estadoColor = '#9e9e9e';
        if (datos.pib) {
            if (datos.pib > 30000) { estado = 'ESTABLE'; estadoColor = '#2e7d32'; }
            else if (datos.pib > 15000) { estado = 'INQUIETO'; estadoColor = '#f57c00'; }
            else { estado = 'CRÍTICO'; estadoColor = '#b71c1c'; }
        }
        const estadoSpan = document.getElementById('pais-estado');
        estadoSpan.innerHTML = `🟢 ${estado}`;
        estadoSpan.style.backgroundColor = estadoColor;

        document.getElementById('objetivos-valor').innerHTML = datos.pib ? Math.round(datos.pib / 1000) : '?';

        let alertasHtml = '';
        if (datos.desempleo && datos.desempleo > 8) alertasHtml += `<div class="alerta-item alerta-roja">🔴 Desempleo alto (${datos.desempleo}%)</div>`;
        if (datos.deuda && datos.deuda > 90) alertasHtml += `<div class="alerta-item alerta-amarilla">🟡 Deuda elevada (${datos.deuda}% PIB)</div>`;
        if (datos.co2 && datos.co2 > 6) alertasHtml += `<div class="alerta-item alerta-roja">🌍 Emisiones CO₂ muy altas (${datos.co2} t/persona)</div>`;
        if (!alertasHtml) alertasHtml = '<div class="alerta-item alerta-verde">✅ Sin alertas destacadas</div>';
        document.getElementById('info-alertas').innerHTML = `<h4 data-i18n="alertas">⚠️ Alertas</h4>${alertasHtml}`;
    },

    mostrarSeccion: function(seccion) {
        const datos = this.datosActuales || {};
        let mensaje = '';
        switch (seccion) {
            case 'economia':
                mensaje = `📊 Datos económicos (Banco Mundial)\nPIB per cápita: ${datos.pib ? `$${datos.pib.toLocaleString()}` : 'No disponible'}\nDesempleo: ${datos.desempleo ? `${datos.desempleo}%` : 'No disponible'}\nDeuda pública: ${datos.deuda ? `${datos.deuda}% PIB` : 'No disponible'}`;
                break;
            case 'social':
                mensaje = `👥 Datos sociales\nPoblación: ${datos.poblacion ? datos.poblacion.toLocaleString() : 'No disponible'}\nEsperanza de vida: ${datos.esperanzaVida ? `${datos.esperanzaVida} años` : 'No disponible'}\nParo juvenil: ${datos.paroJuvenil ? `${datos.paroJuvenil}%` : 'No disponible'}`;
                break;
            case 'clima':
                mensaje = `🌍 Datos climáticos\nCO₂ per cápita: ${datos.co2 ? `${datos.co2} toneladas` : 'No disponible'}\nEnergía per cápita: ${datos.energia ? `${datos.energia.toLocaleString()} kg` : 'No disponible'}`;
                break;
            default:
                mensaje = 'Información en desarrollo.';
        }
        alert(mensaje);
    }
};

window.UIPanelInfo = UIPanelInfo;
