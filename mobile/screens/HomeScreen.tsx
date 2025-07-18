import React, { useEffect, useState } from 'react';
import { FlatList, View, Text } from 'react-native';
import { listarProdutos } from '../api/produtos';
import { Produto } from '../types/Produto';
import { ProdutoCard } from '../components/ProdutoCard';

export default function HomeScreen() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    listarProdutos()
      .then((dados) => {
        console.log('Resposta da API:', dados);

        if (Array.isArray(dados)) {
          const validos = dados.filter((p) => typeof p.id === 'number');
          setProdutos(validos);
        } else {
          console.warn('Resposta inesperada da API:', dados);
        }
      })
      .catch((err) => {
        console.error('Erro ao carregar produtos:', err);
      })
      .finally(() => {
        setCarregando(false);
      });
  }, []);

  if (carregando) return <Text>Carregando...</Text>;

  return (
    <FlatList
      data={produtos}
      keyExtractor={(item, index) =>
        item?.id?.toString?.() || index.toString()
      }
      renderItem={({ item }) => <ProdutoCard produto={item} />}
      ListEmptyComponent={
        <Text style={{ textAlign: 'center' }}>
          Nenhum produto encontrado.
        </Text>
      }
    />
  );
}
