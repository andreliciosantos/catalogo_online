import * as fs from 'fs';
import * as path from 'path';
import * as xlsx from 'xlsx';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Caminhos
const arquivoCSV = path.join(__dirname, '..', '..', 'dados', 'produtos.csv');
const pastaImagensOrigem = path.join(__dirname, '..', '..', 'imagens');
const pastaUploads = path.join(__dirname, '..', '..', 'uploads');

// Garante a existência da pasta de uploads
if (!fs.existsSync(pastaUploads)) {
  fs.mkdirSync(pastaUploads, { recursive: true });
}

function carregarCSV(): any[] {
  if (!fs.existsSync(arquivoCSV)) {
    throw new Error(`❌ Arquivo CSV não encontrado em: ${arquivoCSV}`);
  }

  const conteudo = fs.readFileSync(arquivoCSV, 'utf8');
  const workbook = xlsx.read(conteudo, { type: 'string' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const dados = xlsx.utils.sheet_to_json(sheet);

  // Filtrar apenas os campos necessários
  return dados.map((item: any) => ({
    ean: item.ean || item.EAN || item['EAN '],
    codigo: item.codigo || item.CODIGO || item['Código'] || item['codigo'],
    descricao: item.descricao || item.DESCRICAO || item['Descrição'] || item['descricao'],
  }));
}

async function importar() {
  const dados = carregarCSV();

  for (const item of dados) {
    const { ean, codigo, descricao } = item;

    if (!ean || !codigo || !descricao) {
      console.warn(`⚠️ Dados incompletos, pulando: ${JSON.stringify(item)}`);
      continue;
    }

    const nomeImagem = `${ean}.png`;
    const caminhoImagemOrigem = path.join(pastaImagensOrigem, nomeImagem);
    let imagemUrl = '';

    if (fs.existsSync(caminhoImagemOrigem)) {
      const destino = path.join(pastaUploads, nomeImagem);
      fs.copyFileSync(caminhoImagemOrigem, destino);
      imagemUrl = `/uploads/${nomeImagem}`;
      console.log(`🖼️ Imagem copiada: ${nomeImagem}`);
    } else {
      console.log(`🔍 Imagem ausente: ${nomeImagem}`);
    }

    try {
      await prisma.produto.create({
        data: {
          ean: String(ean),
          codigo: String(codigo),
          descricao: String(descricao),
          preco: 0, // Valor padrão fixo
          imagens: imagemUrl ? [imagemUrl] : [],
        },
      });
      console.log(`✅ Produto importado: ${descricao}`);
    } catch (err) {
      console.error(`❌ Erro ao importar "${descricao}":`, err.message);
    }
  }

  await prisma.$disconnect();
  console.log('🏁 Importação finalizada.');
}

importar();
