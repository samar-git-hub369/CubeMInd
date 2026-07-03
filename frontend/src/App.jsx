import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import axios from 'axios';
import { Cube } from './components/Cube';
import { Controls } from './components/Controls';
import { Scanner } from './components/Scanner';
import './App.css';

function App() {
  const [cubeState, setCubeState] = useState('UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB');
  const [solving, setSolving] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [solution, setSolution] = useState(null);

  const handleSolve = async () => {
    setSolving(true);
    setSolution(null);
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/solve', { state: cubeState });
      if (response.data.status === 'success') {
        setSolution(response.data.solution);
        // In a complete app, we'd iterate over solution moves and animate the Cube state here
      }
    } catch (error) {
      console.error("Failed to solve", error);
    }
    setSolving(false);
  };

  const handleShuffle = () => {
    // A list of pre-computed valid scramble states for the Rubik's Cube
    const scrambles = [
      'FRDLFUDUURRRBRRRRRFBDBFFLFFDBLLDDDDDDLDLLULLLLBBFBBBBF',
      'UUFDUDBBBRRLLRRLDRFRLDFFDFRUDDUDUBDBLBFBLLLLFFUBFBBRRU',
      'DDUBUUFLRFBRRRDDBBLLRFFDBRFFDLBDBURLBLDDLLDUBFUUFFUBRR',
      'BBFBUUBFDRRFRRRDFLRLRFFLUDDFDLFDUULLBLRULLBDBUDBDBDFDF',
      'RLRDUUDDBLFDRRBDDLRDFFFFLFUDLRRDBBBLUULLLUFFBBUUBBFUFR',
      'UDFLUDFFBRDBRRLBRFUURFLLDBRLDBFDBDBFUDFRLLUFBUDULBBBRL'
    ];
    
    // Pick a random scramble that is different from the current one
    let nextScramble;
    do {
      nextScramble = scrambles[Math.floor(Math.random() * scrambles.length)];
    } while (nextScramble === cubeState && scrambles.length > 1);
    
    setCubeState(nextScramble);
    setSolution(null);
  };

  const handleColorsDetected = (colors) => {
    console.log("Scanned colors: ", colors);
    // In a real app, integrate the scanned face into the full 54-char string.
    setShowScanner(false);
  };

  return (
    <div className="app-container">
      <div className="canvas-container">
        <Canvas camera={{ position: [4, 4, 4], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
          <Suspense fallback={null}>
            <Cube cubeState={cubeState} />
            <Environment preset="city" />
            <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2} />
          </Suspense>
          <OrbitControls enablePan={false} minDistance={3} maxDistance={10} />
        </Canvas>
      </div>

      <Controls 
        onSolve={handleSolve} 
        onShuffle={handleShuffle} 
        onEdit={() => setShowScanner(!showScanner)} 
        solving={solving}
      />

      {showScanner && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <h3>Scan Cube Face</h3>
            <Scanner onColorsDetected={handleColorsDetected} />
            <button className="secondary-button" onClick={() => setShowScanner(false)}>Close</button>
          </div>
        </div>
      )}

      {solution && (
        <div className="solution-panel glass-panel">
          <h3>Solution ({solution.length} moves)</h3>
          <div className="moves-list">
            {solution.length > 0 ? solution.join(' ') : "Already Solved!"}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
