function cargarGeoJSON() {
    const url = 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson';
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            geojsonLayer = L.geoJSON(data, {
                style: { color: "#4fc3f7", weight: 1, fillOpacity: 0.3, fillColor: "#4fc3f7" },
                onEachFeature: (feature, layer) => {
                    layer.on('click', async () => {
                        // 🔧 CORRECCIÓN: Usar la propiedad correcta del nombre
                        const nombrePais = feature.properties?.name || 
                                           feature.properties?.admin || 
                                           feature.properties?.ADMIN || 
                                           feature.properties?.NAME || 
                                           "Desconocido";
                        
                        const iso3 = feature.properties['ISO3166-1-Alpha-3'] || 
                                     feature.properties['iso_a3'] || 
                                     feature.properties['ISO_A3'] ||
                                     obtenerISO3PorNombre(nombrePais);
                        
                        paisSeleccionado = nombrePais;
                        console.log(`🔍 Clic en: ${nombrePais} (${iso3})`);
                        
                        // Resaltar país seleccionado
                        geojsonLayer.eachLayer(l => {
                            l.setStyle({ color: "#4fc3f7", weight: 1, fillOpacity: 0.3 });
                        });
                        layer.setStyle({ color: "white", weight: 3, fillOpacity: 0.5 });
                        
                        // Cargar datos del Banco Mundial
                        if (iso3 && iso3 !== '-99' && iso3 !== 'undefined') {
                            await cargarDatosBancoMundial(iso3, nombrePais);
                        } else {
                            document.getElementById("dashboard").innerHTML = `<div class="dashboard-real"><p>📭 No hay datos del Banco Mundial para ${nombrePais}</p></div>`;
                        }
                    });
                }
            }).addTo(mapa);
            console.log("✅ Países cargados correctamente");
        })
        .catch(error => {
            console.error("❌ Error cargando países:", error);
            document.getElementById("dashboard").innerHTML = `<div class="dashboard-real"><p>⚠️ Error al cargar el mapa. Actualiza la página.</p></div>`;
        });
}
