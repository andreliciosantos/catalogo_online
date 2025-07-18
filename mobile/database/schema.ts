import db from './db';

export function criarTabelaProdutos() {
  db.transaction((tx: any) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS produtos (
        id INTEGER PRIMARY KEY NOT NULL,
        ean TEXT,
        codigo TEXT,
        descricao TEXT,
        preco REAL,
        imagemUrl TEXT,
        imagens TEXT,
        criadoEm TEXT,
        updatedAt TEXT
      );`
    );
  });
}
