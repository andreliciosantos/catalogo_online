import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Produto } from '../types/Produto';

interface Props {
  produto: Produto;
}

export function ProdutoCard({ produto }: Props) {
  // Pega a primeira imagem do array, se houver
  const primeiraImagem = produto.imagens?.[0]
    ? `https://improved-telegram-9q6gwvpxvj7fxj49-3000.app.github.dev${produto.imagens[0]}`
    : null;

  return (
    <View style={styles.card}>
      {primeiraImagem ? (
        <Image
          source={{ uri: primeiraImagem }}
          style={styles.imagem}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.imagem, styles.placeholder]}>
          <Text style={{ color: '#999' }}>Sem imagem</Text>
        </View>
      )}
      <Text style={styles.nome}>{produto.descricao}</Text>
      <Text style={styles.preco}>R$ {produto.preco.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  imagem: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  nome: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  preco: {
    marginTop: 4,
    fontSize: 14,
    color: '#555',
  },
});
