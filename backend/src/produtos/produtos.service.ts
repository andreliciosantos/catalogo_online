import { Injectable } from '@nestjs/common';
import { PrismaClient, Produto } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class ProdutosService {
  async criarProduto(data: {
    ean: string;
    codigo: string;
    descricao: string;
    preco: number;
    imagens: string[];
  }): Promise<Produto> {
    return await prisma.produto.create({ data });
  }

  async listarTodos(): Promise<Produto[]> {
    return await prisma.produto.findMany();
  }

  async buscarPorId(id: number): Promise<Produto | null> {
    return await prisma.produto.findUnique({ where: { id } });
  }

  async atualizar(id: number, data: Partial<Produto>): Promise<Produto> {
    return await prisma.produto.update({ where: { id }, data });
  }

  async deletar(id: number): Promise<Produto> {
    return await prisma.produto.delete({ where: { id } });
  }
}
