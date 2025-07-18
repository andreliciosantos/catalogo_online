import * as SQLite from 'expo-sqlite';

const db = (SQLite as any).openDatabase('produtos.db'); // agora funciona

export default db;
