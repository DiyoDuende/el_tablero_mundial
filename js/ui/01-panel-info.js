// ============================================
// PANEL DE INFORMACIÓN DEL PAÍS
// ============================================

const UIPanelInfo = {
    
    datosMock: {
        españa: {
            nombre: 'España',
            estado: 'ESTABLE',
            color: '#2e7d32',
            objetivos: 68,
            alertas: [
                { tipo: 'roja', texto: 'Seguridad energética' },
                { tipo: 'amarilla', texto: 'Desempleo alto' }
            ],
            economia: {
                pib: 2.3,
                inflacion: 2.1,
                deuda: 98,
                desempleo: 11.2
            }
        },
        francia: {
            nombre: 'Francia',
            estado: 'ESTABLE',
            color: '#2e7d32',
            objetivos: 72,
            alertas: [
                { tipo: 'amarilla', texto: 'Protestas sociales' }
            ],
            economia: {
                pib: 1.8,
                inflacion: 2.5,
                deuda: 112,
                desempleo: 7.5
            }
        },
        portugal: {
            nombre: 'Portugal',
            estado: 'INQUIETO',
            color: '#f57c00',
            objetivos: 55,
            alertas: [
                { tipo: 'roja', texto: 'Deuda pública' },
                { tipo: 'amarilla', texto: 'Crecimiento lento' }
            ],
            economia: {
                pib: 1.2,
                inflacion: 2.8,
                deuda: 127,
                desempleo: 6.8
            }
        }
    },
    
    init: function() {
        document.querySelectorAll('.info-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const seccion = e.target.dataset.seccion;
                this.mostrarSeccion(seccion);
            });
        });
    },
    
    mostrarPais: function(paisId) {
        const datos = this.datosMock[paisId] || this.datosMock.españa;
        
        document.getElementById('pais-nombre').innerHTML = `🇪🇸 ${datos.nombre}`;
        document.getElementById('pais-estado').innerHTML = `🟢 ${datos.estado}`;
        document.getElementById('pais-estado').style.background = datos.color;
        document.getElementById('objetivos-valor').innerHTML = `${datos.objetivos}%`;
        
        let alertasHtml = '';
        datos.alertas.forEach(a => {
            alertasHtml += `<div class="alerta-item alerta-${a.tipo}">${a.tipo === 'roja' ? '🔴' : '🟡'} ${a.texto}</div>`;
        });
        document.getElementById('info-alertas').innerHTML = `<h4 data-i18n="alertas">⚠️ Alertas</h4>${alertasHtml}`;
    },
    
    mostrarSeccion: function(seccion) {
        const pais = document.getElementById('pais-nombre').innerText.split(' ')[1].toLowerCase();
        const datos = this.datosMock[pais] || this.datosMock.españa;
        
        let html = '';
        
        switch(seccion) {
            case 'economia':
                html = `
                    <h5>📊 Datos económicos</h5>
                    <p>PIB: ${datos.economia.pib}%</p>
                    <p>Inflación: ${datos.economia.inflacion}%</p>
                    <p>Deuda/PIB: ${datos.economia.deuda}%</p>
                    <p>Desempleo: ${datos.economia.desempleo}%</p>
                `;
                break;
            case 'leyes':
                html = '<p>⚖️ Información legislativa próximamente</p>';
                break;
            case 'geopolitica':
                html = '<p>🏛️ Análisis geopolítico próximamente</p>';
                break;
            case 'social':
                html = '<p>👥 Datos sociales próximamente</p>';
                break;
            case 'clima':
                html = '<p>🌍 Datos climáticos próximamente</p>';
                break;
        }
        
        // Crear modal o panel flotante
        alert(html.replace(/<[^>]*>/g, ' ')); // Simplificado, en producción sería un modal
    }
};

window.UIPanelInfo = UIPanelInfo;
