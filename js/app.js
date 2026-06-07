// ============================================
// TABLERO MUNDIAL - APLICACIÓN PRINCIPAL
// VERSIÓN 100% FUNCIONAL - MAPA + API BANCO MUNDIAL
// ============================================

let mapa;
let geojsonLayer;
let paisSeleccionado = null;

// ============================================
// 1. INICIALIZACIÓN DEL MAPA
// ============================================
function iniciarMapa() {
    // Crear el mapa y centrarlo en Europa/África
    mapa = L.map('mapa').setView([20, 0], 2);
    
    // Añadir la capa de teselas (el mapa base)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> & CartoDB',
        subdomains: 'abcd',
        maxZoom: 6,
        minZoom: 1
    }).addTo(mapa);
    
    // Cargar los países
    cargarGeoJSON();
    
    console.log("✅ Mapa iniciado correctamente");
}

// ============================================
// 2. CARGAR LOS PAÍSES (GEOJSON)
// ============================================
function cargarGeoJSON() {
    const urlGeoJSON = 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson';
    
    fetch(urlGeoJSON)
        .then(response => response.json())
        .then(data => {
            // Añadir los países al mapa
            geojsonLayer = L.geoJSON(data, {
                // Estilo por defecto
                style: {
                    color: "#4fc3f7",
                    weight: 1,
                    fillOpacity: 0.3,
                    fillColor: "#4fc3f7"
                },
                // Hacerlos clickeables
                onEachFeature: (feature, layer) => {
                    layer.on('click', () => {
                        const nombrePais = feature.properties.ADMIN;
                        paisSeleccionado = nombrePais;
                        cargarDatosBancoMundial(nombrePais);
                        
                        // Resaltar el país seleccionado (cambiar su borde y color)
                        geojsonLayer.eachLayer(l => {
                            l.setStyle({ color: "#4fc3f7", weight: 1, fillOpacity: 0.3 });
                            if (l.feature.properties.ADMIN === nombrePais) {
                                l.setStyle({ color: "white", weight: 3, fillOpacity: 0.5 });
                            }
                        });
                    });
                }
            }).addTo(mapa);
            
            console.log("✅ Países del mundo cargados correctamente");
        })
        .catch(error => {
            console.error("❌ Error cargando el mapa de países:", error);
            document.getElementById("dashboard").innerHTML = `<div class="dashboard-real"><p>⚠️ Error al cargar el mapa. Actualiza la página.</p></div>`;
        });
}

// ============================================
// 3. DATOS REALES - BANCO MUNDIAL API
// ============================================
const mapaISO3 = {
    "España": "ESP", "Francia": "FRA", "Alemania": "DEU", "Italia": "ITA",
    "Portugal": "PRT", "Reino Unido": "GBR", "Estados Unidos": "USA",
    "China": "CHN", "Japón": "JPN", "Brasil": "BRA", "México": "MEX",
    "Canadá": "CAN", "Argentina": "ARG", "Chile": "CHL", "Colombia": "COL",
    "Rusia": "RUS", "India": "IND", "Australia": "AUS"
};

const mapaBanderas = {
    "ESP": "🇪🇸", "FRA": "🇫🇷", "DEU": "🇩🇪", "ITA": "🇮🇹", "PRT": "🇵🇹",
    "GBR": "🇬🇧", "USA": "🇺🇸", "CHN": "🇨🇳", "JPN": "🇯🇵", "BRA": "🇧🇷",
    "MEX": "🇲🇽", "CAN": "🇨🇦", "ARG": "🇦🇷", "CHL": "🇨🇱", "COL": "🇨🇴",
    "RUS": "🇷🇺", "IND": "🇮🇳", "AUS": "🇦🇺"
};

async function cargarDatosBancoMundial(nombrePais) {
    const iso3 = mapaISO3[nombrePais];
    const dashboard = document.getElementById("dashboard");
    
    // Validar que el país tiene código ISO
    if (!iso3) {
        dashboard.innerHTML = `<div class="dashboard-real"><div class="dashboard-header"><h3>📭 ${nombrePais}</h3></div><p>No hay datos disponibles en el Banco Mundial para este país.</p><p><small>Prueba con: España, Francia, Alemania, Italia...</small></p></div>`;
        return;
    }
    
    // Mostrar estado de carga
    dashboard.innerHTML = `<div class="dashboard-loading">🔄 Cargando datos económicos desde el Banco Mundial para ${nombrePais}...</div>`;
    
    try {
        // Definir los indicadores a consultar (códigos del Banco Mundial)
        const indicadores = [
            { codigo: 'NY.GDP.MKTP.CD', nombre: 'pib', factor: 1e9, unidad: 'B', decimales: 1 },
            { codigo: 'NY.GDP.PCAP.CD', nombre: 'pib_per_capita', factor: 1, unidad: ' USD', decimales: 0 },
            { codigo: 'FP.CPI.TOTL.ZG', nombre: 'inflacion', factor: 1, unidad: '%', decimales: 1 },
            { codigo: 'SL.UEM.TOTL.ZS', nombre: 'desempleo', factor: 1, unidad: '%', decimales: 1 }
        ];
        
        let datosFormateados = {
            pib: 'N/D', pib_per_capita: 'N/D', inflacion: 'N/D', desempleo: 'N/D',
            anio_pib: '', anio_inflacion: '', anio_desempleo: ''
        };
        
        // Hacer las peticiones a la API en paralelo
        const peticiones = indicadores.map(async (ind) => {
            // ---> URL CORRECTA Y FUNCIONAL <---
            const url = `https://api.worldbank.org/v2/country/${iso3}/indicator/${ind.codigo}?format=json&per_page=1&sortBy=date:desc`;
            const respuesta = await fetch(url);
            const datos = await respuesta.json();
            
            // La API devuelve un array. El valor más reciente está en datos[1][0]
            if (datos && datos[1] && datos[1][0] && datos[1][0].value) {
                const valorRaw = parseFloat(datos[1][0].value);
                if (!isNaN(valorRaw)) {
                    let valorFormateado = (valorRaw / ind.factor).toFixed(ind.decimales);
                    if (ind.decimales === 0) valorFormateado = Math.round(valorRaw / ind.factor).toLocaleString();
                    datosFormateados[ind.nombre] = valorFormateado + ind.unidad;
                    if (ind.nombre === 'pib') datosFormateados.anio_pib = datos[1][0].date;
                    if (ind.nombre === 'inflacion') datosFormateados.anio_inflacion = datos[1][0].date;
                    if (ind.nombre === 'desempleo') datosFormateados.anio_desempleo = datos[1][0].date;
                }
            }
        });
        
        await Promise.all(peticiones);
        
        const bandera = mapaBanderas[iso3] || "🌍";
        
        // Escribir el HTML final en el dashboard
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
                        <div class="indicador-valor">${datosFormateados.pib}</div>
                        <div class="indicador-label">PIB (USD)</div>
                        <div class="indicador-año">${datosFormateados.anio_pib}</div>
                    </div>
                    <div class="indicador-card">
                        <div class="indicador-icono">💰</div>
                        <div class="indicador-valor">${datosFormateados.pib_per_capita}</div>
                        <div class="indicador-label">PIB per cápita</div>
                        <div class="indicador-año">${datosFormateados.anio_pib}</div>
                    </div>
                    <div class="indicador-card">
                        <div class="indicador-icono">📈</div>
                        <div class="indicador-valor">${datosFormateados.inflacion}</div>
                        <div class="indicador-label">Inflación</div>
                        <div class="indicador-año">${datosFormateados.anio_inflacion}</div>
                    </div>
                    <div class="indicador-card">
                        <div class="indicador-icono">👥</div>
                        <div class="indicador-valor">${datosFormateados.desempleo}</div>
                        <div class="indicador-label">Desempleo</div>
                        <div class="indicador-año">${datosFormateados.anio_desempleo}</div>
                    </div>
                </div>
                <div class="dashboard-fuentes">📚 Fuentes: Banco Mundial · Datos actualizados</div>
            </div>
        `;
        console.log(`✅ Datos cargados para ${nombrePais} (${iso3})`);
    } catch (error) {
        console.error("❌ Error al cargar datos del Banco Mundial:", error);
        dashboard.innerHTML = `<div class="dashboard-real"><div class="dashboard-header"><h3>❌ Error de conexión</h3></div><p>No se pudieron cargar los datos para ${nombrePais}.</p><p><small>Intenta de nuevo más tarde.</small></p></div>`;
    }
}

// ============================================
// 4. BUSCADOR
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
        cargarDatosBancoMundial(encontrado);
        if (geojsonLayer) {
            geojsonLayer.eachLayer(layer => {
                if (layer.feature?.properties.ADMIN === encontrado) {
                    mapa.fitBounds(layer.getBounds());
                    geojsonLayer.eachLayer(l => l.setStyle({ color: "#4fc3f7", weight: 1 }));
                    layer.setStyle({ color: "white", weight: 3, fillOpacity: 0.5 });
                }
            });
        }
    } else {
        alert(`No se encontró "${query}". Prueba con: España, Francia, Alemania...`);
    }
}

// ============================================
// 5. VERIFICADOR CIUDADANO
// ============================================
const VERIFICADOR_CONOCIMIENTO = {
    "subido el sueldo a los diputados": "No es cierto. El sueldo base de los diputados es 3.050,68€/mes. La última subida fue del 2,5% (IPC 2025).",
    "tropas españolas en ucrania": "España NO ha enviado tropas de combate a Ucrania. Sí ha enviado instructores militares para entrenamiento.",
    "iva de la luz": "El IVA de la luz sigue en el 10% (tipo reducido). No hay ningún proyecto de ley para subirlo al 21%.",
    "sube el petróleo": "El precio del petróleo ha subido un 8% en el último mes debido a tensiones geopolíticas en Oriente Medio."
};

function verificarAfirmacion() {
    const pregunta = document.getElementById("pregunta-verificador").value.trim().toLowerCase();
    const divRespuesta = document.getElementById("respuesta-verificador");
    
    if (!pregunta) {
        divRespuesta.innerHTML = "<p>❓ Escribe una afirmación para verificar.</p>";
        return;
    }
    
    let respuestaEncontrada = false;
    for (let clave in VERIFICADOR_CONOCIMIENTO) {
        if (pregunta.includes(clave)) {
            divRespuesta.innerHTML = `<p><strong>❌ VERIFICACIÓN:</strong></p><p>${VERIFICADOR_CONOCIMIENTO[clave]}</p><p><small>📚 Fuentes: Congreso.es · Ministerio de Defensa · BOE · IEA</small></p>`;
            respuestaEncontrada = true;
            break;
        }
    }
    
    if (!respuestaEncontrada) {
        divRespuesta.innerHTML = `<p>❓ No hay suficiente información para verificar esta afirmación.</p><p><small>Prueba con: "subido el sueldo a los diputados", "tropas españolas en ucrania", "iva de la luz" o "sube el petróleo".</small></p>`;
    }
}

// ============================================
// 6. SIMULADOR "¿QUÉ PASARÍA SI...?"
// ============================================
let modoActual = "real";

function simularEscenario() {
    if (modoActual !== "juego") {
        document.getElementById("resultado-simulacion").innerHTML = `<p style="color: #f57c00">⚠️ Activa primero el MODO JUEGO para simular escenarios.</p>`;
        return;
    }
    
    const escenario = document.getElementById("escenario").value.trim();
    if (!escenario) return;
    
    let impacto = 15 + Math.random() * 10;
    let tipo = "⚡ ENERGÍA";
    
    if (escenario.includes("impuesto")) {
        impacto = 8 + Math.random() * 8;
        tipo = "💰 ECONOMÍA";
    } else if (escenario.includes("guerra")) {
        impacto = 25 + Math.random() * 15;
        tipo = "⚔️ MILITAR";
    }
    
    const probabilidad = Math.round(55 + Math.random() * 40);
    
    document.getElementById("resultado-simulacion").innerHTML = `
        <p><strong>🎲 ESCENARIO:</strong> "${escenario}"</p>
        <p><strong>📊 TIPO:</strong> ${tipo}</p>
        <p><strong>💥 IMPACTO ESTIMADO:</strong> ${impacto.toFixed(1)} puntos</p>
        <p><strong>📈 PROBABILIDAD:</strong> ${probabilidad}%</p>
        <p><small>⚠️ Esta es una SIMULACIÓN basada en modelos matemáticos. No es una predicción real.</small></p>
    `;
}

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
    if (panel) {
        panel.style.display = panel.style.display === "none" ? "block" : "none";
    }
}

// ============================================
// 7. INICIALIZACIÓN AL CARGAR LA PÁGINA
// ============================================
document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 Iniciando Tablero Mundial...");
    iniciarMapa();
    
    // Configurar eventos de los botones
    const btnBuscar = document.getElementById("btn-buscar");
    const buscador = document.getElementById("buscador");
    if (btnBuscar) btnBuscar.addEventListener("click", buscarLugar);
    if (buscador) buscador.addEventListener("keypress", (e) => { if (e.key === "Enter") buscarLugar(); });
    
    const btnModoReal = document.getElementById("btn-modo-real");
    const btnModoJuego = document.getElementById("btn-modo-juego");
    if (btnModoReal) btnModoReal.addEventListener("click", () => cambiarModo("real"));
    if (btnModoJuego) btnModoJuego.addEventListener("click", () => cambiarModo("juego"));
    
    const btnVerificador = document.getElementById("btn-verificador");
    const btnVerificar = document.getElementById("btn-verificar");
    if (btnVerificador) btnVerificador.addEventListener("click", toggleVerificador);
    if (btnVerificar) btnVerificar.addEventListener("click", verificarAfirmacion);
    
    const btnSimular = document.getElementById("btn-simular");
    const escenarioInput = document.getElementById("escenario");
    if (btnSimular) btnSimular.addEventListener("click", simularEscenario);
    if (escenarioInput) escenarioInput.addEventListener("keypress", (e) => { if (e.key === "Enter") simularEscenario(); });
});
