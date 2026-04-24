import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('app_habitos_saludables.db');

const init = () => {
    db.execSync(`
        CREATE TABLE IF NOT EXISTS habitos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            completado INTEGER DEFAULT 0,
            fecha_creacion TEXT DEFAULT (datetime('now'))
        );
    `);
};

const obtenerHabitos = () => {
    return db.getAllSync('SELECT * FROM habitos ORDER BY fecha_creacion DESC');
};

const agregarHabito = (titulo) => {
    return db.runSync('INSERT INTO habitos (titulo) VALUES (?)', [titulo]);
};

const actualizarHabito = (id, completado) => {
    return db.runSync('UPDATE habitos SET completado = ? WHERE id = ?', [completado ? 1 : 0, id]);
};

const eliminarHabito = (id) => {
    return db.runSync('DELETE FROM habitos WHERE id = ?', [id]);
};

export default {
    init,
    obtenerHabitos,
    agregarHabito,
    actualizarHabito,
    eliminarHabito,
};
