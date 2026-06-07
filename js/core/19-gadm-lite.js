// js/core/19-gadm-lite.js
// Solo identidad, sin geometrías (menos de 1MB para el mundo entero)

const GADM_LITE = {
  "ESP.1.4_1": {
    nombre: "Nerva",
    nivel: 3,
    padre: "ESP.1_1",
    nombres_padres: ["España", "Andalucía", "Huelva"]
  },
  // ... más entradas generadas desde datos públicos
};

function buscarLugar(nombre) {
  // Búsqueda por nombre aproximado
  const resultados = [];
  for (const [id, data] of Object.entries(GADM_LITE)) {
    if (data.nombre.toLowerCase().includes(nombre.toLowerCase())) {
      resultados.push({ id, ...data });
    }
  }
  return resultados;
}
