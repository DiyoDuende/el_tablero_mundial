// ============================================
// TABLERO MUNDIAL - APLICACIÓN PRINCIPAL
// ============================================

let mapa;
let capaActual = "economia";
let modoActual = "real";
let geojsonLayer;
let paisSeleccionado = null;

// ============================================
// 1. INICIALIZACIÓN DEL MAPA
// ============================================
function iniciarMapa() {
    mapa = L.map('mapa').setView([20, 0], 2);
    
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> & CartoDB',
        subdomains: 'abcd',
        maxZoom: 6,
        minZoom: 1
    }).addTo(mapa);
    
    cargarGeoJSON();
}

// ============================================
// 2. CARGAR GEOJSON DE PAÍSES
// ============================================
function cargarGeoJSON() {
    fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
        .then(response => response.json())
        .then(data => {
            geojsonLayer = L.geoJSON(data, {
                style: (feature) => obtenerEstilo(feature.properties.ADMIN),
                onEachFeature: (feature, layer) => {
                    layer.on('click', () => {
                        const nombrePais = feature.properties.ADMIN;
                        paisSeleccionado = nombrePais;
                        mostrarDashboard(nombrePais);
                    });
                }
            }).addTo(mapa);
        })
        .catch(error => {
            console.error("Error cargando GeoJSON:", error);
            mostrarPlaceholderMapa();
        });
}

// ============================================
// 3. OBTENER ESTILO SEGÚN CAPA Y PAÍS
// ============================================
function obtenerEstilo(nombrePais) {
    const pais = PAISES[nombrePais];
    if (!pais) return { color: "#555", weight: 1, fillOpacity: 0.3, fillColor: "#888" };
    
    const config = COLORES_CAPA[capaActual];
    if (!config) return { color: "#4fc3f7", weight: 1, fillOpacity: 0.3, fillColor: "#4fc3f7" };
    
    const valor = config.valor(pais);
    let color = "#888";
    
    for (let nivel of config.niveles) {
        if (valor >= nivel.min && valor < nivel.max) {
            color = nivel.color;
            break;
        }
    }
    
    // Resaltar país seleccionado
    const esSeleccionado = (paisSeleccionado === nombrePais);
    
    return {
        color: esSeleccionado ? "#fff" : color,
        weight: esSeleccionado ? 3 : 1,
        fillOpacity: 0.6,
        fillColor: color
    };
}

// ============================================
// 4. ACTUALIZAR MAPA AL CAMBIAR CAPA
// ============================================
function actualizarMapa() {
    if (!geojsonLayer) return;
    
    geojsonLayer.eachLayer(layer => {
        const props = layer.feature?.properties;
        if (props) {
            layer.setStyle(obtenerEstilo(props.ADMIN));
        }
    });
}

// ============================================
// 5. MOSTRAR DASHBOARD CON DATOS ECONÓMICOS
// ============================================
function mostrarDashboard(nombrePais) {
    const pais = PAISES[nombrePais];
    const dashboard = document.getElementById("dashboard");
    
    if (!pais) {
        dashboard.innerHTML = `
            <div class="placeholder">
                📭 No hay datos disponibles para ${nombrePais}<br>
                <small>Los datos se están actualizando desde fuentes oficiales...</small>
            </div>
        `;
        return;
    }
    
    const eco = pais.economia;
    const pol = pais.politica;
    
    dashboard.innerHTML = `
        <h3>🇪🇸 ${nombrePais}</h3>
        <div class="dashboard-grid">
            <div class="dashboard-card">
                <h4>💰 PIB</h4>
                <div class="valor">${eco.pib}%</div>
                <small>Crecimiento anual</small>
            </div>
            <div class="dashboard-card">
                <h4>📈 Inflación</h4>
                <div class="valor">${eco.inflacion}%</div>
                <small>IPC interanual</small>
            </div>
            <div class="dashboard-card">
                <h4>👥 Paro</h4>
                <div class="valor">${eco.paro}%</div>
                <small>Población activa</small>
            </div>
            <div class="dashboard-card">
                <h4>🏛️ Deuda/PIB</h4>
                <div class="valor">${eco.deuda}%</div>
                <small>Deuda pública</small>
            </div>
            <div class="dashboard-card">
                <h4>⚖️ Estabilidad</h4>
                <div class="valor">${pol.estabilidad}%</div>
                <small>Índice de estabilidad</small>
            </div>
            <div class="dashboard-card">
                <h4>⚡ Energía renovable</h4>
                <div class="valor">${pais.energia.renovables}%</div>
                <small>Porcentaje del mix</small>
            </div>
        </div>
        <div class="dashboard-footer">
            📚 Fuentes: Banco Mundial · INE · Eurostat · Datos actualizados a junio 2026
        </div>
    `;
}

// ============================================
// 6. BUSCADOR GLOBAL
// ============================================
function buscarLugar() {
    const query = document.getElementById("buscador").value.trim();
    if (!query) return;
    
    // Buscar coincidencia en países
    let encontrado = null;
    for (let nombre in PAISES) {
        if (nombre.toLowerCase().includes(query.toLowerCase())) {
            encontrado = nombre;
            break;
        }
    }
    
    if (encontrado) {
        paisSeleccionado = encontrado;
        mostrarDashboard(encontrado);
        
        // Centrar mapa en el país (aproximado)
        if (geojsonLayer) {
            geojsonLayer.eachLayer(layer => {
                if (layer.feature?.properties.ADMIN === encontrado) {
                    mapa.fitBounds(layer.getBounds());
                }
            });
        }
        actualizarMapa();
    } else {
        alert(`No se encontró "${query}". Prueba con: España, Francia, Alemania, Italia...`);
    }
}

// ============================================
// 7. VERIFICADOR CIUDADANO
// ============================================
function verificarAfirmacion() {
    const pregunta = document.getElementById("pregunta-verificador").value.trim().toLowerCase();
    const divRespuesta = document.getElementById("respuesta-verificador");
    
    if (!pregunta) {
        divRespuesta.innerHTML = "<p>❓ Escribe una afirmación para verificar.</p>";
        return;
    }
    
    let resultado = null;
    for (let clave in VERIFICADOR_CONOCIMIENTO) {
        if (pregunta.includes(clave)) {
            resultado = VERIFICADOR_CONOCIMIENTO[clave];
            break;
        }
    }
    
    if (resultado) {
        const icono = resultado.estado === "falso" ? "❌" : (resultado.estado === "verdadero" ? "✅" : "❓");
        divRespuesta.innerHTML = `
            <p><strong>${icono} VERIFICACIÓN:</strong></p>
            <p>${resultado.respuesta}</p>
            <p><small>📚 Fuentes: ${resultado.fuentes.join(" · ")}</small></p>
        `;
    } else {
        divRespuesta.innerHTML = `
            <p>❓ No hay suficiente información para verificar esta afirmación.</p>
            <p><small>Prueba con: "¿subió el sueldo a los diputados?" o "¿sube el petróleo?"</small></p>
        `;
    }
}

// ============================================
// 8. SIMULADOR "¿QUÉ PASARÍA SI...?"
// ============================================
function simularEscenario() {
    if (modoActual !== "juego") {
        document.getElementById("resultado-simulacion").innerHTML = `
            <p style="color: #f57c00">⚠️ Activa primero el MODO JUEGO para simular escenarios.</p>
        `;
        return;
    }
    
    const escenario = document.getElementById("escenario").value.trim();
    if (!escenario) return;
    
    // Simulación básica con la fórmula madre
    let impacto = 0;
    let tipo = "";
    
    if (escenario.includes("petróleo") || escenario.includes("petroleo")) {
        impacto = 15 + Math.random() * 10;
        tipo = "⚡ ENERGÍA";
    } else if (escenario.includes("impuesto") || escenario.includes("impuestos")) {
        impacto = 8 + Math.random() * 8;
        tipo = "💰 ECONOMÍA";
    } else if (escenario.includes("guerra") || escenario.includes("conflicto")) {
        impacto = 25 + Math.random() * 15;
        tipo = "⚔️ MILITAR";
    } else {
        impacto = 5 + Math.random() * 15;
        tipo = "🌍 GENERAL";
    }
    
    const resultado = `
        <p><strong>🎲 ESCENARIO:</strong> "${escenario}"</p>
        <p><strong>📊 TIPO:</strong> ${tipo}</p>
        <p><strong>💥 IMPACTO ESTIMADO:</strong> ${impacto.toFixed(1)} puntos</p>
        <p><strong>📈 PROBABILIDAD:</strong> ${Math.round(50 + Math.random() * 40)}%</p>
        <p><small>⚠️ Esta es una SIMULACIÓN basada en modelos matemáticos. No es una predicción real.</small></p>
    `;
    
    document.getElementById("resultado-simulacion").innerHTML = resultado;
}

// ============================================
// 9. CAMBIAR MODO (REAL / JUEGO)
// ============================================
function cambiarModo(modo) {
    modoActual = modo;
    const btnReal = document.getElementById("btn-modo-real");
    const btnJuego = document.getElementById("btn-modo-juego");
    
    if (modo === "real") {
        btnReal.classList.add("active");
        btnJuego.classList.remove("active");
        document.getElementById("simulador-panel").style.opacity = "0.6";
    } else {
        btnJuego.classList.add("active");
        btnReal.classList.remove("active");
        document.getElementById("simulador-panel").style.opacity = "1";
    }
}

// ============================================
// 10. CAMBIAR CAPA Y ACTUALIZAR MAPA
// ============================================
function cambiarCapa(capa) {
    capaActual = capa;
    document.querySelectorAll(".capa-btn").forEach(btn => {
        if (btn.dataset.capa === capa) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
    actualizarMapa();
}

// ============================================
// 11. MOSTRAR/OCULTAR VERIFICADOR
// ============================================
function toggleVerificador() {
    const panel = document.getElementById("verificador-panel");
    if (panel.style.display === "none") {
        panel.style.display = "block";
    } else {
        panel.style.display = "none";
    }
}

// ============================================
// 12. MAPA DE PRUEBA SI FALLA GEOJSON
// ============================================
function mostrarPlaceholderMapa() {
    const mapDiv = document.getElementById("mapa");
    mapDiv.innerHTML = `
        <div style="display: flex; justify-content: center; align-items: center; height: 100%; flex-direction: column; gap: 10px;">
            <span style="font-size: 3rem;">🗺️</span>
            <p>Cargando mapa mundial...</p>
            <p style="font-size: 0.8rem; color: #888;">Si no carga automáticamente, actualiza la página</p>
        </div>
    `;
}

// ============================================
// 13. EVENTOS Y INICIALIZACIÓN
// ============================================
document.addEventListener("DOMContentLoaded", () => {
    iniciarMapa();
    
    // Botón de buscar
    document.getElementById("btn-buscar").addEventListener("click", buscarLugar);
    document.getElementById("buscador").addEventListener("keypress", (e) => {
        if (e.key === "Enter") buscarLugar();
    });
    
    // Botones de capas
    document.querySelectorAll(".capa-btn").forEach(btn => {
        btn.addEventListener("click", () => cambiarCapa(btn.dataset.capa));
    });
    
    // Botones de modo
    document.getElementById("btn-modo-real").addEventListener("click", () => cambiarModo("real"));
    document.getElementById("btn-modo-juego").addEventListener("click", () => cambiarModo("juego"));
    
    // Verificador
    document.getElementById("btn-verificador").addEventListener("click", toggleVerificador);
    document.getElementById("btn-verificar").addEventListener("click", verificarAfirmacion);
    document.getElementById("pregunta-verificador").addEventListener("keypress", (e) => {
        if (e.key === "Enter") verificarAfirmacion();
    });
    
    // Simulador
    document.getElementById("btn-simular").addEventListener("click", simularEscenario);
    document.getElementById("escenario").addEventListener("keypress", (e) => {
        if (e.key === "Enter") simularEscenario();
    });
});
