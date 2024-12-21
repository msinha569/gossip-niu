import React from 'react'; 
import { Outlet } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import { BackgroundBeamsWithCollision } from './components/ui/background-beams-with-collision';

function App() {
  return (
    <div className="relative">
        <Header />
      <BackgroundBeamsWithCollision className="fixed h-full inset-0 -z-10" />
      <div className="text-center relative z-10">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
