import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import { useEffect } from 'react';
import { criarTabelaProdutos } from './database/schema';

useEffect(() => {
  criarTabelaProdutos();
}, []);

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, marginTop: StatusBar.currentHeight || 0 }}>
      <HomeScreen />
    </SafeAreaView>
  );
}
