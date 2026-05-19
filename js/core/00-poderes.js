// 00-poderes.js - Actores de poder globales y nacionales
window.PODERES = {
    globales: [
        { id: "eeuu", nombre: "Estados Unidos", esfera: "económica-militar", influencia: 95 },
        { id: "china", nombre: "China", esfera: "económica-tecnológica", influencia: 92 },
        { id: "ue", nombre: "Unión Europea", esfera: "normativa-energética", influencia: 88 },
        { id: "rusia", nombre: "Rusia", esfera: "energética-militar", influencia: 75 }
    ],
    corporaciones: [
        { id: "bigtech", nombre: "Big Tech (Google, Meta, Microsoft)", poder_tecnologico: 96 },
        { id: "finanzas", nombre: "Fondos de inversión (BlackRock, Vanguard)", poder_economico: 94 }
    ],
    nacionales: {
        españa: {
            gobierno: { estabilidad: 68, fuerza_legislativa: 55 },
            oposicion: { fragmentacion: 45, influencia_medios: 62 },
            actores_economicos: { banca: 80, energéticas: 72 }
        }
    }
};
console.log("✅ 00-poderes.js cargado");
