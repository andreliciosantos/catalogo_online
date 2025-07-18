import axios from 'axios';
import { Produto } from '../types/Produto';

// Coloque o IP da máquina onde o back está rodando
const api = axios.create({
  baseURL: 'https://improved-telegram-9q6gwvpxvj7fxj49-3000.app.github.dev/',
});

export async function listarProdutos(): Promise<Produto[]> {
  const response = await api.get('/produtos');
  return response.data;
}
