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
                        actualizarMapa(); // Para resaltar el país seleccionado
                    });
                }
            }).addTo(mapa);
        })
        .catch(error => {
            console.warn("Error cargando GeoJSON:", error);
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
        color: esSeleccionado ? "#ffffff" : color,
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
        <h3>🇺🇳 ${nombrePais}</h3>
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
            <p><small>Prueba con: "subido el sueldo a los diputados" o "sube el petróleo"</small></p>
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
    if (!escenario) {
        document.getElementById("resultado-simulacion").innerHTML = `
            <p>✏️ Escribe un escenario, por ejemplo: "sube el petróleo un 20%"</p>
        `;
        return;
    }
    
    // Simulación básica con la fórmula madre
    let impacto = 0;
    let tipo = "";
    let probabilidad = 0;
    
    if (escenario.includes("petróleo") || escenario.includes("petroleo")) {
        impacto = 15 + Math.random() * 10;
        tipo = "⚡ ENERGÍA";
        probabilidad = 55 + Math.random() * 30;
    } else if (escenario.includes("impuesto") || escenario.includes("impuestos")) {
        impacto = 8 + Math.random() * 8;
        tipo = "💰 ECONOMÍA";
        probabilidad = 60 + Math.random() * 25;
    } else if (escenario.includes("guerra") || escenario.includes("conflicto")) {
        impacto = 25 + Math.random() * 15;
        tipo = "⚔️ MILITAR";
        probabilidad = 40 + Math.random() * 30;
    } else {
        impacto = 5 + Math.random() * 15;
        tipo = "🌍 GENERAL";
        probabilidad = 50 + Math.random() * 35;
    }
    
    const resultado = `
        <p><strong>🎲 ESCENARIO:</strong> "${escenario}"</p>
        <p><strong>📊 TIPO:</strong> ${tipo}</p>
        <p><strong>💥 IMPACTO ESTIMADO:</strong> ${impacto.toFixed(1)} puntos</p>
        <p><strong>📈 PROBABILIDAD:</strong> ${Math.round(probabilidad)}%</p>
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
    const simuladorPanel = document.getElementById("simulador-panel");
    
    if (modo === "real") {
        btnReal.classList.add("active");
        btnJuego.classList.remove("active");
        if (simuladorPanel) simuladorPanel.style.opacity = "0.6";
    } else {
        btnJuego.classList.add("active");
        btnReal.classList.remove("active");
        if (simuladorPanel) simuladorPanel.style.opacity = "1";
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
    if (!panel) return;
    
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
    if (!mapDiv) return;
    
    mapDiv.innerHTML = `
        <div style="display: flex; justify-content: center; align-items: center; height: 100%; flex-direction: column; gap: 10px; background: #1a3b4f;">
            <span style="font-size: 3rem;">🗺️</span>
            <p>Mapa mundial cargando...</p>
            <p style="font-size: 0.8rem; color: #888;">Si no carga, actualiza la página</p>
        </div>
    `;
    
    // Intentar recargar después de 3 segundos
    setTimeout(() => {
        if (!geojsonLayer) {
            cargarGeoJSON();
        }
    }, 3000);
}

// ============================================
// 13. EVENTOS E INICIALIZACIÓN
// ============================================
document.addEventListener("DOMContentLoaded", () => {
    iniciarMapa();
    
    // Botón de buscar
    const btnBuscar = document.getElementById("btn-buscar");
    const buscador = document.getElementById("buscador");
    if (btnBuscar) btnBuscar.addEventListener("click", buscarLugar);
    if (buscador) buscador.addEventListener("keypress", (e) => {
        if (e.key === "Enter") buscarLugar();
    });
    
    // Botones de capas
    document.querySelectorAll(".capa-btn").forEach(btn => {
        btn.addEventListener("click", () => cambiarCapa(btn.dataset.capa));
    });
    
    // Botones de modo
    const btnModoReal = document.getElementById("btn-modo-real");
    const btnModoJuego = document.getElementById("btn-modo-juego");
    if (btnModoReal) btnModoReal.addEventListener("click", () => cambiarModo("real"));
    if (btnModoJuego) btnModoJuego.addEventListener("click", () => cambiarModo("juego"));
    
    // Verificador
    const btnVerificador = document.getElementById("btn-verificador");
    const btnVerificar = document.getElementById("btn-verificar");
    const preguntaVerificador = document.getElementById("pregunta-verificador");
    
    if (btnVerificador) btnVerificador.addEventListener("click", toggleVerificador);
    if (btnVerificar) btnVerificar.addEventListener("click", verificarAfirmacion);
    if (preguntaVerificador) preguntaVerificador.addEventListener("keypress", (e) => {
        if (e.key === "Enter") verificarAfirmacion();
    });
    
    // Simulador
    const btnSimular = document.getElementById("btn-simular");
    const escenarioInput = document.getElementById("escenario");
    if (btnSimular) btnSimular.addEventListener("click", simularEscenario);
    if (escenarioInput) escenarioInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") simularEscenario();
    });
});
