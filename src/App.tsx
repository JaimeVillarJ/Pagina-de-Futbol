import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Noticias } from './components/Noticias';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Calendario } from './components/Calendario';
import { Login } from './components/Login';
import { Posiciones } from './components/Posiciones';

import "./styles/general.css";
import "./styles/background.css";
import { Goleadores } from './components/Goleadores';


function App() {
  const [categoria, setCategoria] = useState<string | null>(null);

  useEffect(() => {
    const storedCategoria = localStorage.getItem("categoria");
    setCategoria(storedCategoria);
  }, []);

  return (
    <div className='background'>
      <Header categoria={categoria} />
      <Routes>
        <Route path='/' element={<Noticias categoria={categoria} />} />
        <Route path='/Calendario' element={<Calendario categoria={categoria}/>} />
        <Route path='/Posiciones' element={<Posiciones/>} />
        <Route path='/Goleadores' element={<Goleadores categoria={categoria} />} />
        <Route path='/Login' element={<Login />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
