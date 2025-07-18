import { Produto } from '../types/Produto';
import { View, Text, Image, StyleSheet } from 'react-native';

interface Props {
  produto: Produto;
}

export function ProdutoCard({ produto }: Props) {
  const imagem = produto.imagens?.[0] || produto.imagemUrl || '';

  return (
    <View style={styles.card}>
      {imagem ? (
        <Image source={{ uri: `http://192.168.0.100:3000${imagem}` }} style={styles.imagem} />
      ) : (
        <View style={[styles.imagem, styles.placeholder]} />
      )}
      <Text style={styles.nome}>{produto.descricao}</Text>
      <Text style={styles.preco}>R$ {produto.preco.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    margin: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 2,
  },
  imagem: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    backgroundColor: '#ddd',
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
    fontSize: 14,
    color: 'green',
  },
});
