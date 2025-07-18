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

// Lê e converte o CSV
function carregarCSV(): any[] {
  if (!fs.existsSync(arquivoCSV)) {
    throw new Error(`❌ Arquivo CSV não encontrado em: ${arquivoCSV}`);
  }

  const conteudo = fs.readFileSync(arquivoCSV, 'utf8');
  const workbook = xlsx.read(conteudo, { type: 'string' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const dados = xlsx.utils.sheet_to_json(sheet);

  return dados.map((item: any) => ({
    ean: String(item.ean || item.EAN || item['EAN '] || '').trim(),
    codigo: String(item.codigo || item.CODIGO || item['Código'] || item['codigo'] || '').trim(),
    descricao: String(item.descricao || item.DESCRICAO || item['Descrição'] || item['descricao'] || '').trim(),
  }));
}

async function importar() {
  const dados = carregarCSV();
  const extensoesPossiveis = ['.png', '.jpg', '.jpeg', '.webp'];

  for (const item of dados) {
    const { ean, codigo, descricao } = item;

    if (!ean || !codigo || !descricao) {
      console.warn(`⚠️ Dados incompletos, pulando: ${JSON.stringify(item)}`);
      continue;
    }

    // Verifica se o produto já existe
    const existente = await prisma.produto.findFirst({
      where: { ean },
    });

    let imagemUrl = '';
    let imagemEncontrada = false;

    for (const ext of extensoesPossiveis) {
      const nomeImagem = `${ean}${ext}`;
      const origem = path.join(pastaImagensOrigem, nomeImagem);
      const destino = path.join(pastaUploads, nomeImagem);

      if (fs.existsSync(origem)) {
        fs.copyFileSync(origem, destino);
        imagemUrl = `/uploads/${nomeImagem}`;
        imagemEncontrada = true;
        console.log(`🖼️ Imagem encontrada e copiada: ${nomeImagem}`);
        break;
      }
    }

    if (existente) {
      // Atualiza a imagem se ainda não existir
      if (imagemEncontrada && (!existente.imagens || existente.imagens.length === 0)) {
        await prisma.produto.updateMany({
          where: { ean },
          data: { imagens: [imagemUrl] },
        });
        console.log(`♻️ Produto existente atualizado com imagem: ${descricao}`);
      } else {
        console.log(`⏩ Produto já existe e não precisa de atualização: ${descricao}`);
      }
      continue;
    }

    // Criação de novo produto
    try {
      await prisma.produto.create({
        data: {
          ean,
          codigo,
          descricao,
          preco: 0,
          imagens: imagemEncontrada ? [imagemUrl] : [],
        },
      });
      console.log(`✅ Produto importado: ${descricao}`);
    } catch (err: any) {
      console.error(`❌ Erro ao importar "${descricao}" (EAN ${ean}):`, err.message);
    }
  }

  await prisma.$disconnect();
  console.log('🏁 Importação finalizada.');
}

importar();
