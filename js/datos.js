// Base de datos de países (datos de ejemplo - luego se reemplazará con API real)
const PAISES = {
    "España": {
        economia: { pib: 2.3, inflacion: 2.1, paro: 11.2, deuda: 98, crecimiento: 1.8 },
        politica: { estabilidad: 68, corrupcion: 45, democracia: 78 },
        militar: { gasto_pib: 1.3, personal: 120000, rango_global: 20 },
        energia: { renovables: 45, dependencia_exterior: 73, precio_luz: 0.12 },
        social: { protestas: 12, satisfaccion: 65, desigualdad: 33 },
        clima: { emisiones: 280, temperatura_anomalia: 1.2, riesgo_sequia: 45 }
    },
    "Francia": {
        economia: { pib: 1.8, inflacion: 2.5, paro: 7.5, deuda: 110, crecimiento: 1.2 },
        politica: { estabilidad: 72, corrupcion: 38, democracia: 82 },
        militar: { gasto_pib: 1.9, personal: 200000, rango_global: 8 },
        energia: { renovables: 25, dependencia_exterior: 85, precio_luz: 0.14 },
        social: { protestas: 18, satisfaccion: 60, desigualdad: 30 },
        clima: { emisiones: 310, temperatura_anomalia: 1.1, riesgo_sequia: 30 }
    },
    "Alemania": {
        economia: { pib: 1.5, inflacion: 2.2, paro: 5.8, deuda: 66, crecimiento: 0.9 },
        politica: { estabilidad: 85, corrupcion: 25, democracia: 90 },
        militar: { gasto_pib: 1.5, personal: 180000, rango_global: 12 },
        energia: { renovables: 52, dependencia_exterior: 65, precio_luz: 0.16 },
        social: { protestas: 8, satisfaccion: 75, desigualdad: 28 },
        clima: { emisiones: 680, temperatura_anomalia: 1.0, riesgo_sequia: 15 }
    },
    "Italia": {
        economia: { pib: 1.2, inflacion: 2.3, paro: 9.8, deuda: 144, crecimiento: 0.8 },
        politica: { estabilidad: 55, corrupcion: 52, democracia: 70 },
        militar: { gasto_pib: 1.4, personal: 160000, rango_global: 15 },
        energia: { renovables: 40, dependencia_exterior: 75, precio_luz: 0.13 },
        social: { protestas: 14, satisfaccion: 58, desigualdad: 35 },
        clima: { emisiones: 320, temperatura_anomalia: 1.3, riesgo_sequia: 40 }
    },
    "Portugal": {
        economia: { pib: 2.0, inflacion: 2.0, paro: 6.5, deuda: 112, crecimiento: 1.6 },
        politica: { estabilidad: 70, corrupcion: 42, democracia: 75 },
        militar: { gasto_pib: 1.2, personal: 28000, rango_global: 45 },
        energia: { renovables: 58, dependencia_exterior: 70, precio_luz: 0.11 },
        social: { protestas: 6, satisfaccion: 70, desigualdad: 32 },
        clima: { emisiones: 180, temperatura_anomalia: 1.4, riesgo_sequia: 50 }
    },
    "Reino Unido": {
        economia: { pib: 1.4, inflacion: 2.8, paro: 4.2, deuda: 101, crecimiento: 1.0 },
        politica: { estabilidad: 65, corrupcion: 35, democracia: 85 },
        militar: { gasto_pib: 2.2, personal: 150000, rango_global: 6 },
        energia: { renovables: 42, dependencia_exterior: 60, precio_luz: 0.18 },
        social: { protestas: 10, satisfaccion: 62, desigualdad: 34 },
        clima: { emisiones: 350, temperatura_anomalia: 0.9, riesgo_sequia: 10 }
    },
    "Estados Unidos": {
        economia: { pib: 2.5, inflacion: 2.9, paro: 3.9, deuda: 122, crecimiento: 2.0 },
        politica: { estabilidad: 60, corrupcion: 38, democracia: 83 },
        militar: { gasto_pib: 3.4, personal: 1300000, rango_global: 1 },
        energia: { renovables: 21, dependencia_exterior: 35, precio_luz: 0.10 },
        social: { protestas: 15, satisfaccion: 55, desigualdad: 41 },
        clima: { emisiones: 4800, temperatura_anomalia: 1.0, riesgo_sequia: 25 }
    },
    "China": {
        economia: { pib: 4.8, inflacion: 1.5, paro: 5.2, deuda: 77, crecimiento: 4.5 },
        politica: { estabilidad: 80, corrupcion: 42, democracia: 25 },
        militar: { gasto_pib: 1.7, personal: 2000000, rango_global: 2 },
        energia: { renovables: 35, dependencia_exterior: 28, precio_luz: 0.07 },
        social: { protestas: 3, satisfaccion: 72, desigualdad: 38 },
        clima: { emisiones: 10500, temperatura_anomalia: 1.1, riesgo_sequia: 20 }
    },
    "Rusia": {
        economia: { pib: 1.2, inflacion: 5.2, paro: 4.8, deuda: 19, crecimiento: 0.5 },
        politica: { estabilidad: 45, corrupcion: 65, democracia: 28 },
        militar: { gasto_pib: 4.1, personal: 900000, rango_global: 3 },
        energia: { renovables: 12, dependencia_exterior: 15, precio_luz: 0.05 },
        social: { protestas: 8, satisfaccion: 50, desigualdad: 36 },
        clima: { emisiones: 1600, temperatura_anomalia: 1.5, riesgo_sequia: 10 }
    },
    "México": {
        economia: { pib: 2.1, inflacion: 4.2, paro: 3.5, deuda: 52, crecimiento: 1.9 },
        politica: { estabilidad: 48, corrupcion: 68, democracia: 65 },
        militar: { gasto_pib: 0.6, personal: 200000, rango_global: 30 },
        energia: { renovables: 18, dependencia_exterior: 42, precio_luz: 0.09 },
        social: { protestas: 20, satisfaccion: 48, desigualdad: 45 },
        clima: { emisiones: 480, temperatura_anomalia: 1.2, riesgo_sequia: 35 }
    },
    "Argentina": {
        economia: { pib: -2.5, inflacion: 80, paro: 7.5, deuda: 85, crecimiento: -1.5 },
        politica: { estabilidad: 35, corrupcion: 70, democracia: 68 },
        militar: { gasto_pib: 0.7, personal: 72000, rango_global: 40 },
        energia: { renovables: 12, dependencia_exterior: 10, precio_luz: 0.08 },
        social: { protestas: 28, satisfaccion: 35, desigualdad: 42 },
        clima: { emisiones: 200, temperatura_anomalia: 1.1, riesgo_sequia: 30 }
    },
    "Brasil": {
        economia: { pib: 1.5, inflacion: 4.5, paro: 8.2, deuda: 73, crecimiento: 1.2 },
        politica: { estabilidad: 42, corrupcion: 72, democracia: 70 },
        militar: { gasto_pib: 1.3, personal: 360000, rango_global: 14 },
        energia: { renovables: 85, dependencia_exterior: 8, precio_luz: 0.11 },
        social: { protestas: 18, satisfaccion: 52, desigualdad: 53 },
        clima: { emisiones: 480, temperatura_anomalia: 1.0, riesgo_sequia: 25 }
    }
};

// Colores para cada capa
const COLORES_CAPA = {
    economia: {
        niveles: [
            { min: 3, max: 10, color: "#2e7d32", label: "Crecimiento alto" },
            { min: 1, max: 3, color: "#66bb6a", label: "Crecimiento moderado" },
            { min: 0, max: 1, color: "#ffa726", label: "Estancamiento" },
            { min: -10, max: 0, color: "#ef5350", label: "Recesión" }
        ],
        valor: (pais) => pais.economia?.pib || 0
    },
    politica: {
        niveles: [
            { min: 80, max: 100, color: "#2e7d32", label: "Muy estable" },
            { min: 60, max: 80, color: "#66bb6a", label: "Estable" },
            { min: 40, max: 60, color: "#ffa726", label: "Tensión" },
            { min: 0, max: 40, color: "#ef5350", label: "Inestable" }
        ],
        valor: (pais) => pais.politica?.estabilidad || 50
    },
    militar: {
        niveles: [
            { min: 0.1, max: 0.5, color: "#2e7d32", label: "Gasto bajo" },
            { min: 0.5, max: 1, color: "#66bb6a", label: "Gasto moderado" },
            { min: 1, max: 2, color: "#ffa726", label: "Gasto significativo" },
            { min: 2, max: 10, color: "#ef5350", label: "Gasto alto" }
        ],
        valor: (pais) => pais.militar?.gasto_pib || 1
    },
    energia: {
        niveles: [
            { min: 60, max: 100, color: "#2e7d32", label: "Alta renovable" },
            { min: 30, max: 60, color: "#66bb6a", label: "Media renovable" },
            { min: 10, max: 30, color: "#ffa726", label: "Baja renovable" },
            { min: 0, max: 10, color: "#ef5350", label: "Muy baja renovable" }
        ],
        valor: (pais) => pais.energia?.renovables || 20
    },
    social: {
        niveles: [
            { min: 0, max: 5, color: "#2e7d32", label: "Pocas protestas" },
            { min: 5, max: 15, color: "#66bb6a", label: "Protestas moderadas" },
            { min: 15, max: 25, color: "#ffa726", label: "Muchas protestas" },
            { min: 25, max: 100, color: "#ef5350", label: "Conflictos sociales" }
        ],
        valor: (pais) => pais.social?.protestas || 10
    },
    clima: {
        niveles: [
            { min: 0, max: 15, color: "#2e7d32", label: "Riesgo bajo" },
            { min: 15, max: 30, color: "#66bb6a", label: "Riesgo moderado" },
            { min: 30, max: 50, color: "#ffa726", label: "Riesgo alto" },
            { min: 50, max: 100, color: "#ef5350", label: "Riesgo crítico" }
        ],
        valor: (pais) => pais.clima?.riesgo_sequia || 20
    }
};

// Base de conocimiento para el verificador
const VERIFICADOR_CONOCIMIENTO = {
    "subido el sueldo a los diputados": {
        estado: "falso",
        respuesta: "No es cierto. El sueldo base de los diputados es 3.050,68€/mes. La última subida fue del 2,5% (IPC 2025).",
        fuentes: ["Congreso.es", "BOE"]
    },
    "tropas españolas en ucrania": {
        estado: "falso",
        respuesta: "España NO ha enviado tropas de combate a Ucrania. Sí ha enviado instructores militares para entrenamiento en países vecinos.",
        fuentes: ["Ministerio de Defensa", "EFE"]
    },
    "subido el iva de la luz": {
        estado: "falso",
        respuesta: "El IVA de la luz sigue en el 10% (tipo reducido). No hay ningún proyecto de ley para subirlo al 21%.",
        fuentes: ["BOE", "Ministerio de Hacienda"]
    },
    "sube el petróleo": {
        estado: "incierto",
        respuesta: "El precio del petróleo ha subido un 8% en el último mes debido a tensiones geopolíticas en Oriente Medio.",
        fuentes: ["International Energy Agency", "Bloomberg"]
    }
};
