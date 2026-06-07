// js/ui/09-dashboard.js - Versión simplificada para prueba
var DashboardReal = {
    mostrar: function(iso3, nivel, nombreMostrar) {
        console.log("📊 Dashboard.mostrar llamado con:", { iso3, nivel, nombreMostrar });
        
        var container = document.getElementById('dashboard-container');
        if (!container) {
            console.error("❌ No se encontró dashboard-container");
            return;
        }
        
        // Si es España, mostrar datos de ejemplo
        if (iso3 === 'ESP') {
            container.innerHTML = `
                <div class="dashboard-real">
                    <div class="dashboard-header">
                        <h2>🇪🇸 ${nombreMostrar || 'España'}</h2>
                    </div>
                    <div class="indicadores-grid">
                        <div class="indicador-card">
                            <div class="indicador-icono">💰</div>
                            <div class="indicador-valor">35,327 $</div>
                            <div class="indicador-label">PIB per cápita</div>
                            <div class="indicador-año">2024</div>
                        </div>
                        <div class="indicador-card">
                            <div class="indicador-icono">📈</div>
                            <div class="indicador-valor">2.8%</div>
                            <div class="indicador-label">Inflación</div>
                            <div class="indicador-año">2024</div>
                        </div>
                        <div class="indicador-card">
                            <div class="indicador-icono">👥</div>
                            <div class="indicador-valor">10.4%</div>
                            <div class="indicador-label">Desempleo</div>
                            <div class="indicador-año">2025</div>
                        </div>
                    </div>
                    <div class="dashboard-fuentes">📚 Fuentes: Banco Mundial · Datos oficiales</div>
                </div>
            `;
            console.log("✅ Dashboard actualizado con datos de prueba");
        } else {
            container.innerHTML = `<div class="dashboard-error">⚠️ Datos no disponibles para ${iso3}</div>`;
        }
    }
};

window.DashboardReal = DashboardReal;
console.log("✅ DashboardReal cargado (versión de prueba)");
