export interface Produto {
  id: number;
  ean: string;
  codigo: string;
  descricao: string;
  preco: number;
  imagemUrl?: string;
  imagens?: string[]; // compatível com múltiplas imagens
  criadoEm: string;
}
