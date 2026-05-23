const Buscador = {
    buscar(texto, data) {
        const lower = texto.toLowerCase();
        return Object.values(data).filter(item => item.nombre && item.nombre.toLowerCase().includes(lower));
    }
};
window.Buscador = Buscador;
