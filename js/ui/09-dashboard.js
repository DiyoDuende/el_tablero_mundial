// js/ui/09-dashboard.js
// ============================================
// DASHBOARD REAL - Datos del Banco Mundial
// ============================================

const DashboardReal = {
    async mostrar(iso3) {
        if (!iso3) return;
        if (!APIBancoMundial.isSoportado(iso3)) return;
        
        const container = document.getElementById('dashboard-container');
        if (!container) return;
        
        container.innerHTML = '<div class="loading-spinner">🌐 Cargando datos del Banco Mundial...</div>';
        
        const datos = await CacheDatos.obtenerDatos(iso3);
        if (!datos || !datos.pib) {
            container.innerHTML = `<div class="dashboard-error">⚠️ No se pudieron obtener datos de ${iso3}</div>`;
            return;
        }
        
        const nombre = APIBancoMundial.paisesSoportados[iso3];
        const pib = datos.pib.valor ? Math.round(datos.pib.valor).toLocaleString() : 'N/D';
        const pibAnio = datos.pib.año || '2024';
        const inflacion = datos.inflacion?.valor ? datos.inflacion.valor.toFixed(1) : 'N/D';
        const inflacionAnio = datos.inflacion?.año || '2024';
        const desempleo = datos.desempleo?.valor ? datos.desempleo.valor.toFixed(1) : 'N/D';
        const desempleoAnio = datos.desempleo?.año || '2024';
        const deuda = datos.deuda?.valor ? datos.deuda.valor.toFixed(1) : 'N/D';
        const deudaAnio = datos.deuda?.año || '2024';
        
        container.innerHTML = `
            <div class="dashboard-real">
                <div class="dashboard-header">
                    <h2>${nombre}</h2>
                    <span class="pais-codigo">${iso3}</span>
                </div>
                <div class="indicadores-grid">
                    <div class="indicador-card">
                        <div class="indicador-icono">💰</div>
                        <div class="indicador-valor">${pib} $</div>
                        <div class="indicador-label">PIB per cápita</div>
                        <div class="indicador-año">${pibAnio}</div>
                    </div>
                    <div class="indicador-card">
                        <div class="indicador-icono">📈</div>
                        <div class="indicador-valor">${inflacion}%</div>
                        <div class="indicador-label">Inflación</div>
                        <div class="indicador-año">${inflacionAnio}</div>
                    </div>
                    <div class="indicador-card">
                        <div class="indicador-icono">👥</div>
                        <div class="indicador-valor">${desempleo}%</div>
                        <div class="indicador-label">Desempleo</div>
                        <div class="indicador-año">${desempleoAnio}</div>
                    </div>
                    <div class="indicador-card">
                        <div class="indicador-icono">🏛️</div>
                        <div class="indicador-valor">${deuda}%</div>
                        <div class="indicador-label">Deuda pública</div>
                        <div class="indicador-año">${deudaAnio}</div>
                    </div>
                </div>
                <div class="dashboard-fuentes">📚 Fuentes: Banco Mundial · Datos oficiales</div>
            </div>
        `;
    }
};

window.DashboardReal = DashboardReal;
