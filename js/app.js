// ============================================
// TABLERO MUNDIAL - APLICACIÓN PRINCIPAL
// VERSIÓN CORREGIDA - MAPA + DATOS FUNCIONALES
// ============================================

let mapa;
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
    console.log("✅ Mapa iniciado");
}

// ============================================
// 2. CARGAR PAÍSES (GEOJSON)
// ============================================
function cargarGeoJSON() {
    const url = 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson';
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            geojsonLayer = L.geoJSON(data, {
                style: { color: "#4fc3f7", weight: 1, fillOpacity: 0.3, fillColor: "#4fc3f7" },
                onEachFeature: (feature, layer) => {
                    layer.on('click', async () => {
                        // Obtener nombre del país e ISO3
                        const nombrePais = feature.properties?.ADMIN || 
                                           feature.properties?.name || 
                                           feature.properties?.admin || 
                                           "Desconocido";
                        
                        const iso3 = feature.properties?.['ISO3166-1-Alpha-3'] || 
                                     feature.properties?.iso_a3 || 
                                     obtenerISO3PorNombre(nombrePais);
                        
                        paisSeleccionado = nombrePais;
                        console.log(`🔍 Clic en: ${nombrePais} (${iso3})`);
                        
                        // Resaltar país seleccionado
                        geojsonLayer.eachLayer(l => {
                            l.setStyle({ color: "#4fc3f7", weight: 1, fillOpacity: 0.3 });
                        });
                        layer.setStyle({ color: "white", weight: 3, fillOpacity: 0.5 });
                        
                        // Cargar datos del Banco Mundial
                        const dashboard = document.getElementById("dashboard-container");
                        if (iso3 && iso3 !== '-99') {
                            await cargarDatosBancoMundial(iso3, nombrePais);
                        } else {
                            if (dashboard) dashboard.innerHTML = `<div class="dashboard-real"><p>📭 No hay datos del Banco Mundial para ${nombrePais}</p></div>`;
                        }
                    });
                }
            }).addTo(mapa);
            console.log("✅ Países cargados correctamente");
        })
        .catch(error => {
            console.error("❌ Error cargando países:", error);
            const dashboard = document.getElementById("dashboard-container");
            if (dashboard) dashboard.innerHTML = `<div class="dashboard-real"><p>⚠️ Error al cargar el mapa. Actualiza la página.</p></div>`;
        });
}

// Fallback para obtener ISO3
function obtenerISO3PorNombre(nombre) {
    const mapa = {
        "España": "ESP", "Francia": "FRA", "Alemania": "DEU", "Italia": "ITA",
        "Portugal": "PRT", "Reino Unido": "GBR", "Estados Unidos": "USA",
        "China": "CHN", "Japón": "JPN", "Brasil": "BRA", "México": "MEX",
        "Canadá": "CAN", "Argentina": "ARG", "Chile": "CHL", "Colombia": "COL",
        "Rusia": "RUS", "India": "IND", "Australia": "AUS"
    };
    return mapa[nombre] || null;
}

// ============================================
// 3. DATOS ECONÓMICOS - BANCO MUNDIAL API
// ============================================
async function cargarDatosBancoMundial(iso3, nombrePais) {
    const dashboard = document.getElementById("dashboard-container");
    if (!dashboard) return;
    
    dashboard.innerHTML = `<div class="dashboard-loading">🔄 Cargando datos económicos para ${nombrePais}...</div>`;
    
    try {
        const indicadores = [
            'NY.GDP.MKTP.CD', 'NY.GDP.PCAP.CD', 'FP.CPI.TOTL.ZG', 'SL.UEM.TOTL.ZS'
        ];
        
        const resultados = {};
        
        for (const indicador of indicadores) {
            const url = `https://api.worldbank.org/v2/country/${iso3}/indicator/${indicador}?format=json&per_page=1&sortBy=date:desc`;
            const response = await fetch(url);
            const data = await response.json();
            
            if (data && data[1] && data[1][0] && data[1][0].value) {
                const valor = parseFloat(data[1][0].value);
                resultados[indicador] = { valor: isNaN(valor) ? null : valor, anio: data[1][0].date };
            } else {
                resultados[indicador] = { valor: null, anio: null };
            }
        }
        
        const bandera = getBandera(iso3);
        const pib = resultados['NY.GDP.MKTP.CD']?.valor ? (resultados['NY.GDP.MKTP.CD'].valor / 1e9).toFixed(1) + 'B' : 'N/D';
        const pibPerCapita = resultados['NY.GDP.PCAP.CD']?.valor ? Math.round(resultados['NY.GDP.PCAP.CD'].valor).toLocaleString() + ' USD' : 'N/D';
        const inflacion = resultados['FP.CPI.TOTL.ZG']?.valor ? resultados['FP.CPI.TOTL.ZG'].valor.toFixed(1) + '%' : 'N/D';
        const desempleo = resultados['SL.UEM.TOTL.ZS']?.valor ? resultados['SL.UEM.TOTL.ZS'].valor.toFixed(1) + '%' : 'N/D';
        
        dashboard.innerHTML = `
            <div class="dashboard-real">
                <div class="dashboard-header">
                    <div class="pais-titulo">
                        <span class="pais-bandera">${bandera}</span>
                        <h3>${nombrePais}</h3>
                        <span class="pais-codigo">${iso3}</span>
                    </div>
                </div>
                <div class="indicadores-grid">
                    <div class="indicador-card"><div class="indicador-icono">📊</div><div class="indicador-valor">${pib}</div><div class="indicador-label">PIB (USD)</div><div class="indicador-año">${resultados['NY.GDP.MKTP.CD']?.anio || ''}</div></div>
                    <div class="indicador-card"><div class="indicador-icono">💰</div><div class="indicador-valor">${pibPerCapita}</div><div class="indicador-label">PIB per cápita</div><div class="indicador-año">${resultados['NY.GDP.PCAP.CD']?.anio || ''}</div></div>
                    <div class="indicador-card"><div class="indicador-icono">📈</div><div class="indicador-valor">${inflacion}</div><div class="indicador-label">Inflación</div><div class="indicador-año">${resultados['FP.CPI.TOTL.ZG']?.anio || ''}</div></div>
                    <div class="indicador-card"><div class="indicador-icono">👥</div><div class="indicador-valor">${desempleo}</div><div class="indicador-label">Desempleo</div><div class="indicador-año">${resultados['SL.UEM.TOTL.ZS']?.anio || ''}</div></div>
                </div>
                <div class="dashboard-fuentes">📚 Fuentes: Banco Mundial · Datos actualizados</div>
            </div>
        `;
        console.log(`✅ Datos cargados para ${nombrePais} (${iso3})`);
    } catch (error) {
        console.error("❌ Error en API:", error);
        dashboard.innerHTML = `<div class="dashboard-real"><h3>❌ Error</h3><p>No se pudieron cargar los datos para ${nombrePais}</p></div>`;
    }
}

function getBandera(iso3) {
    const banderas = {
        'ESP': '🇪🇸', 'FRA': '🇫🇷', 'DEU': '🇩🇪', 'ITA': '🇮🇹', 'PRT': '🇵🇹',
        'GBR': '🇬🇧', 'USA': '🇺🇸', 'CHN': '🇨🇳', 'JPN': '🇯🇵', 'BRA': '🇧🇷',
        'MEX': '🇲🇽', 'CAN': '🇨🇦', 'ARG': '🇦🇷', 'CHL': '🇨🇱', 'COL': '🇨🇴',
        'RUS': '🇷🇺', 'IND': '🇮🇳', 'AUS': '🇦🇺'
    };
    return banderas[iso3] || '🌍';
}

// ============================================
// 4. BUSCADOR
// ============================================
function buscarLugar() {
    const query = document.getElementById("buscador").value.trim();
    if (!query) return;
    
    const paises = {
        "España": "ESP", "Francia": "FRA", "Alemania": "DEU", "Italia": "ITA",
        "Portugal": "PRT", "Reino Unido": "GBR", "Estados Unidos": "USA"
    };
    
    let encontrado = null;
    for (let nombre in paises) {
        if (nombre.toLowerCase().includes(query.toLowerCase())) {
            encontrado = nombre;
            break;
        }
    }
    
    if (encontrado) {
        cargarDatosBancoMundial(paises[encontrado], encontrado);
    } else {
        alert(`No se encontró "${query}"`);
    }
}

// ============================================
// 5. VERIFICADOR CIUDADANO
// ============================================
function verificarAfirmacion() {
    const pregunta = document.getElementById("pregunta-verificador").value.trim().toLowerCase();
    const divRespuesta = document.getElementById("respuesta-verificador");
    
    if (!pregunta) {
        divRespuesta.innerHTML = "<p>❓ Escribe una afirmación para verificar.</p>";
        return;
    }
    
    const respuestas = {
        "subido el sueldo a los diputados": "❌ Falso. El sueldo base es 3.050,68€/mes.",
        "tropas españolas en ucrania": "❌ Falso. No hay tropas de combate.",
        "iva de la luz": "❌ Falso. Sigue en el 10%.",
        "sube el petróleo": "✅ Verdadero. Ha subido un 8%."
    };
    
    let respuesta = "❓ No hay información suficiente.";
    for (let clave in respuestas) {
        if (pregunta.includes(clave)) {
            respuesta = respuestas[clave];
            break;
        }
    }
    
    divRespuesta.innerHTML = `<p>${respuesta}</p><p><small>📚 Fuentes oficiales</small></p>`;
}

// ============================================
// 6. SIMULADOR
// ============================================
let modoActual = "real";

function simularEscenario() {
    if (modoActual !== "juego") {
        document.getElementById("resultado-simulacion").innerHTML = `<p style="color:#f57c00">⚠️ Activa MODO JUEGO para simular</p>`;
        return;
    }
    
    const escenario = document.getElementById("escenario").value.trim();
    if (!escenario) return;
    
    const impacto = (15 + Math.random() * 10).toFixed(1);
    document.getElementById("resultado-simulacion").innerHTML = `
        <p><strong>🎲 ESCENARIO:</strong> "${escenario}"</p>
        <p><strong>💥 IMPACTO:</strong> ${impacto} puntos</p>
        <p><strong>📈 PROBABILIDAD:</strong> ${Math.round(55 + Math.random() * 40)}%</p>
        <p><small>⚠️ SIMULACIÓN educativa</small></p>
    `;
}

function cambiarModo(modo) {
    modoActual = modo;
    const btnReal = document.getElementById("btn-modo-real");
    const btnJuego = document.getElementById("btn-modo-juego");
    const simulador = document.getElementById("simulador-panel");
    
    if (modo === "real") {
        btnReal.classList.add("active");
        btnJuego.classList.remove("active");
        if (simulador) simulador.style.opacity = "0.6";
    } else {
        btnJuego.classList.add("active");
        btnReal.classList.remove("active");
        if (simulador) simulador.style.opacity = "1";
    }
}

function toggleVerificador() {
    const panel = document.getElementById("verificador-panel");
    if (panel) panel.style.display = panel.style.display === "none" ? "block" : "none";
}

// ============================================
// 7. INICIALIZACIÓN
// ============================================
document.addEventListener("DOMContentLoaded", () => {
    iniciarMapa();
    
    document.getElementById("btn-buscar").addEventListener("click", buscarLugar);
    document.getElementById("buscador").addEventListener("keypress", (e) => { if (e.key === "Enter") buscarLugar(); });
    
    document.getElementById("btn-modo-real").addEventListener("click", () => cambiarModo("real"));
    document.getElementById("btn-modo-juego").addEventListener("click", () => cambiarModo("juego"));
    document.getElementById("btn-verificador").addEventListener("click", toggleVerificador);
    document.getElementById("btn-verificar").addEventListener("click", verificarAfirmacion);
    document.getElementById("btn-simular").addEventListener("click", simularEscenario);
    document.getElementById("escenario").addEventListener("keypress", (e) => { if (e.key === "Enter") simularEscenario(); });
});
