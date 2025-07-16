import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class ProdutosService {
  async criarProduto(data: {
    nome: string;
    descricao: string;
    preco: number;
    imagemUrl: string;
  }) {
    return await prisma.produto.create({ data });
  }

  async listarTodos() {
    return await prisma.produto.findMany();
  }

  async buscarPorId(id: number) {
    return await prisma.produto.findUnique({ where: { id } });
  }

  async atualizar(id: number, data: any) {
    return await prisma.produto.update({ where: { id }, data });
  }

  async deletar(id: number) {
    return await prisma.produto.delete({ where: { id } });
  }
}
