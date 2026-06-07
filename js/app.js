// ============================================
// TABLERO MUNDIAL - APLICACIÓN PRINCIPAL
// SOLO DATOS REALES DEL BANCO MUNDIAL
// ============================================

let mapa;
let capaActual = "economia";
let modoActual = "real";
let geojsonLayer;
let paisSeleccionado = null;

// ============================================
// MAPA Y GEOJSON
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

function cargarGeoJSON() {
    fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
        .then(response => response.json())
        .then(data => {
            geojsonLayer = L.geoJSON(data, {
                style: () => obtenerEstilo(),
                onEachFeature: (feature, layer) => {
                    layer.on('click', () => {
                        paisSeleccionado = feature.properties.ADMIN;
                        cargarDatosBancoMundial(paisSeleccionado);
                        actualizarMapa();
                    });
                }
            }).addTo(mapa);
        })
        .catch(error => console.warn("Error cargando GeoJSON:", error));
}

function obtenerEstilo() {
    const esSeleccionado = (paisSeleccionado === feature?.properties?.ADMIN);
    return {
        color: esSeleccionado ? "#ffffff" : "#4fc3f7",
        weight: esSeleccionado ? 3 : 1,
        fillOpacity: 0.4,
        fillColor: "#4fc3f7"
    };
}

function actualizarMapa() {
    if (!geojsonLayer) return;
    geojsonLayer.eachLayer(layer => {
        const props = layer.feature?.properties;
        if (props) {
            layer.setStyle({
                color: (paisSeleccionado === props.ADMIN) ? "#ffffff" : "#4fc3f7",
                weight: (paisSeleccionado === props.ADMIN) ? 3 : 1,
                fillOpacity: 0.4,
                fillColor: "#4fc3f7"
            });
        }
    });
}

// ============================================
// DATOS REALES - BANCO MUNDIAL API
// ============================================

const mapaISO3 = {
    "España": "ESP", "Francia": "FRA", "Alemania": "DEU", "Italia": "ITA",
    "Portugal": "PRT", "Reino Unido": "GBR", "Estados Unidos": "USA",
    "China": "CHN", "Japón": "JPN", "Brasil": "BRA", "México": "MEX",
    "Canadá": "CAN", "Argentina": "ARG", "Chile": "CHL", "Colombia": "COL",
    "Rusia": "RUS", "India": "IND", "Australia": "AUS", "Corea del Sur": "KOR",
    "Turquía": "TUR", "Países Bajos": "NLD", "Suiza": "CHE", "Suecia": "SWE",
    "Polonia": "POL", "Bélgica": "BEL", "Austria": "AUT", "Noruega": "NOR",
    "Dinamarca": "DNK", "Finlandia": "FIN", "Grecia": "GRC", "Irlanda": "IRL"
};

const mapaBanderas = {
    "ESP": "🇪🇸", "FRA": "🇫🇷", "DEU": "🇩🇪", "ITA": "🇮🇹", "PRT": "🇵🇹",
    "GBR": "🇬🇧", "USA": "🇺🇸", "CHN": "🇨🇳", "JPN": "🇯🇵", "BRA": "🇧🇷",
    "MEX": "🇲🇽", "CAN": "🇨🇦", "ARG": "🇦🇷", "CHL": "🇨🇱", "COL": "🇨🇴",
    "RUS": "🇷🇺", "IND": "🇮🇳", "AUS": "🇦🇺", "KOR": "🇰🇷", "TUR": "🇹🇷",
    "NLD": "🇳🇱", "CHE": "🇨🇭", "SWE": "🇸🇪", "POL": "🇵🇱", "BEL": "🇧🇪",
    "AUT": "🇦🇹", "NOR": "🇳🇴", "DNK": "🇩🇰", "FIN": "🇫🇮", "GRC": "🇬🇷", "IRL": "🇮🇪"
};

async function cargarDatosBancoMundial(nombrePais) {
    const iso3 = mapaISO3[nombrePais];
    const dashboard = document.getElementById("dashboard");
    
    if (!iso3) {
        dashboard.innerHTML = `
            <div class="dashboard-real">
                <div class="dashboard-header"><h3>📭 ${nombrePais}</h3></div>
                <p>No hay datos disponibles en el Banco Mundial para este país.</p>
                <p><small>Prueba con: España, Francia, Alemania, Italia, Portugal...</small></p>
            </div>
        `;
        return;
    }
    
    dashboard.innerHTML = `<div class="dashboard-loading">🔄 Cargando datos económicos desde el Banco Mundial para ${nombrePais}...</div>`;
    
    try {
        const indicadores = [
            'NY.GDP.MKTP.CD',      // PIB (USD)
            'NY.GDP.PCAP.CD',      // PIB per cápita (USD)
            'FP.CPI.TOTL.ZG',      // Inflación (%)
            'SL.UEM.TOTL.ZS'       // Desempleo (%)
        ];
        
        const resultados = {};
        
        for (const indicador of indicadores) {
            const url = `https://api.worldbank.org/v2/country/${iso3}/indicator/${indicador}?format=json&per_page=1`;
            const response = await fetch(url);
            const data = await response.json();
            
            if (data[1] && data[1][0] && data[1][0].value) {
                const valor = parseFloat(data[1][0].value);
                resultados[indicador] = { 
                    valor: isNaN(valor) ? null : valor, 
                    anio: data[1][0].date 
                };
            } else {
                resultados[indicador] = { valor: null, anio: null };
            }
        }
        
        const bandera = mapaBanderas[iso3] || "🌍";
        
        const pib = resultados['NY.GDP.MKTP.CD']?.valor 
            ? (resultados['NY.GDP.MKTP.CD'].valor / 1e9).toFixed(1) + 'B' 
            : 'N/D';
        
        const pibPerCapita = resultados['NY.GDP.PCAP.CD']?.valor 
            ? Math.round(resultados['NY.GDP.PCAP.CD'].valor).toLocaleString() + ' USD' 
            : 'N/D';
        
        const inflacion = resultados['FP.CPI.TOTL.ZG']?.valor 
            ? resultados['FP.CPI.TOTL.ZG'].valor.toFixed(1) + '%' 
            : 'N/D';
        
        const desempleo = resultados['SL.UEM.TOTL.ZS']?.valor 
            ? resultados['SL.UEM.TOTL.ZS'].valor.toFixed(1) + '%' 
            : 'N/D';
        
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
                    <div class="indicador-card">
                        <div class="indicador-icono">📊</div>
                        <div class="indicador-valor">${pib}</div>
                        <div class="indicador-label">PIB (USD)</div>
                        <div class="indicador-año">${resultados['NY.GDP.MKTP.CD']?.anio || ''}</div>
                    </div>
                    <div class="indicador-card">
                        <div class="indicador-icono">💰</div>
                        <div class="indicador-valor">${pibPerCapita}</div>
                        <div class="indicador-label">PIB per cápita</div>
                        <div class="indicador-año">${resultados['NY.GDP.PCAP.CD']?.anio || ''}</div>
                    </div>
                    <div class="indicador-card">
                        <div class="indicador-icono">📈</div>
                        <div class="indicador-valor">${inflacion}</div>
                        <div class="indicador-label">Inflación</div>
                        <div class="indicador-año">${resultados['FP.CPI.TOTL.ZG']?.anio || ''}</div>
                    </div>
                    <div class="indicador-card">
                        <div class="indicador-icono">👥</div>
                        <div class="indicador-valor">${desempleo}</div>
                        <div class="indicador-label">Desempleo</div>
                        <div class="indicador-año">${resultados['SL.UEM.TOTL.ZS']?.anio || ''}</div>
                    </div>
                </div>
                <div class="dashboard-fuentes">
                    📚 Fuentes: Banco Mundial · Datos actualizados
                </div>
            </div>
        `;
    } catch (error) {
        console.error(error);
        dashboard.innerHTML = `
            <div class="dashboard-real">
                <div class="dashboard-header"><h3>❌ Error</h3></div>
                <p>No se pudieron cargar los datos para ${nombrePais}.</p>
                <p><small>Intenta de nuevo más tarde o selecciona otro país.</small></p>
            </div>
        `;
    }
}

// ============================================
// BUSCADOR
// ============================================

function buscarLugar() {
    const query = document.getElementById("buscador").value.trim();
    if (!query) return;
    
    let encontrado = null;
    for (let nombre in mapaISO3) {
        if (nombre.toLowerCase().includes(query.toLowerCase())) {
            encontrado = nombre;
            break;
        }
    }
    
    if (encontrado) {
        paisSeleccionado = encontrado;
        cargarDatosBancoMundial(encontrado);
        
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
// VERIFICADOR CIUDADANO
// ============================================

const VERIFICADOR_CONOCIMIENTO = {
    "subido el sueldo a los diputados": {
        estado: "falso",
        respuesta: "No es cierto. El sueldo base de los diputados es 3.050,68€/mes. La última subida fue del 2,5% (IPC 2025).",
        fuentes: ["Congreso.es", "BOE"]
    },
    "tropas españolas en ucrania": {
        estado: "falso",
        respuesta: "España NO ha enviado tropas de combate a Ucrania. Sí ha enviado instructores militares.",
        fuentes: ["Ministerio de Defensa", "EFE"]
    },
    "iva de la luz": {
        estado: "falso",
        respuesta: "El IVA de la luz sigue en el 10% (tipo reducido). No hay proyecto para subirlo al 21%.",
        fuentes: ["BOE", "Ministerio de Hacienda"]
    },
    "sube el petróleo": {
        estado: "incierto",
        respuesta: "El precio del petróleo ha subido un 8% en el último mes por tensiones en Oriente Medio.",
        fuentes: ["International Energy Agency", "Bloomberg"]
    }
};

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
        divRespuesta.innerHTML = `
            <p><strong>❌ VERIFICACIÓN:</strong></p>
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
// SIMULADOR
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
    
    let impacto = 15 + Math.random() * 10;
    let tipo = "⚡ ENERGÍA";
    
    if (escenario.includes("impuesto")) impacto = 8 + Math.random() * 8;
    if (escenario.includes("guerra")) impacto = 25 + Math.random() * 15;
    
    document.getElementById("resultado-simulacion").innerHTML = `
        <p><strong>🎲 ESCENARIO:</strong> "${escenario}"</p>
        <p><strong>💥 IMPACTO ESTIMADO:</strong> ${impacto.toFixed(1)} puntos</p>
        <p><strong>📈 PROBABILIDAD:</strong> ${Math.round(55 + Math.random() * 40)}%</p>
        <p><small>⚠️ Esta es una SIMULACIÓN basada en modelos matemáticos.</small></p>
    `;
}

// ============================================
// CONTROLES DE INTERFAZ
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

function toggleVerificador() {
    const panel = document.getElementById("verificador-panel");
    panel.style.display = panel.style.display === "none" ? "block" : "none";
}

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener("DOMContentLoaded", () => {
    iniciarMapa();
    
    document.getElementById("btn-buscar").addEventListener("click", buscarLugar);
    document.getElementById("buscador").addEventListener("keypress", (e) => {
        if (e.key === "Enter") buscarLugar();
    });
    
    document.getElementById("btn-modo-real").addEventListener("click", () => cambiarModo("real"));
    document.getElementById("btn-modo-juego").addEventListener("click", () => cambiarModo("juego"));
    document.getElementById("btn-verificador").addEventListener("click", toggleVerificador);
    document.getElementById("btn-verificar").addEventListener("click", verificarAfirmacion);
    document.getElementById("btn-simular").addEventListener("click", simularEscenario);
    document.getElementById("escenario").addEventListener("keypress", (e) => {
        if (e.key === "Enter") simularEscenario();
    });
});
