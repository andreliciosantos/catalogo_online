import {
  Controller,
  Post,
  Get,
  Param,
  Put,
  Delete,
  Body,
  UploadedFile,
} from '@nestjs/common';
import { ProdutosService } from './produtos.service';
import {
  ApiConsumes,
  ApiBody,
  ApiTags,
} from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { join } from 'path';
import * as fs from 'fs';

@ApiTags('produtos')
@Controller('produtos')
export class ProdutosController {
  constructor(private readonly service: ProdutosService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nome: { type: 'string' },
        descricao: { type: 'string' },
        preco: { type: 'number' },
        imagem: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async criar(@UploadedFile() file: any, @Body() body: any, req: FastifyRequest) {
    const { nome, descricao, preco } = body;
    const fileBuffer = await file.toBuffer();

    const filename = `${Date.now()}-${file.filename}`;
    const filePath = join(__dirname, '..', '..', 'uploads', filename);

    fs.writeFileSync(filePath, fileBuffer);

    const produto = await this.service.criarProduto({
      nome,
      descricao,
      preco: parseFloat(preco),
      imagemUrl: `/uploads/${filename}`,
    });

    return produto;
  }

  @Get()
  listar() {
    return this.service.listarTodos();
  }

  @Get(':id')
  buscar(@Param('id') id: string) {
    return this.service.buscarPorId(Number(id));
  }

  @Put(':id')
  atualizar(@Param('id') id: string, @Body() data: any) {
    return this.service.atualizar(Number(id), data);
  }

  @Delete(':id')
  deletar(@Param('id') id: string) {
    return this.service.deletar(Number(id));
  }
}
