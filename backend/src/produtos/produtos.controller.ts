import {
  Controller,
  Post,
  Get,
  Param,
  Put,
  Delete,
  Body,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ProdutosService } from './produtos.service';
import {
  ApiConsumes,
  ApiBody,
  ApiTags,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import * as fs from 'fs';

@ApiTags('produtos')
@Controller('produtos')
export class ProdutosController {
  constructor(private readonly service: ProdutosService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('imagens'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ean: { type: 'string' },
        codigo: { type: 'string' },
        descricao: { type: 'string' },
        preco: { type: 'number' },
        imagens: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  async criar(@UploadedFiles() files: Express.Multer.File[], @Body() body: any) {
    const { ean, codigo, descricao, preco } = body;

    const imagensSalvas: string[] = [];

    for (const file of files) {
      const filename = `${Date.now()}-${file.originalname}`;
      const filePath = join(__dirname, '..', '..', 'uploads', filename);
      fs.writeFileSync(filePath, file.buffer);
      imagensSalvas.push(`/uploads/${filename}`);
    }

    const produto = await this.service.criarProduto({
      ean,
      codigo,
      descricao,
      preco: parseFloat(preco),
      imagens: imagensSalvas,
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
