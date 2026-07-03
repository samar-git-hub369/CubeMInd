import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

const COLORS = {
  U: '#FFFFFF', // Up: White
  D: '#FFD500', // Down: Yellow
  R: '#B71234', // Right: Red
  L: '#009B48', // Left: Green
  F: '#FF5800', // Front: Orange
  B: '#0046AD', // Back: Blue
  X: '#202020'  // Inner core
};

export function Cube({ cubeState, ...props }) {
  const group = useRef();

  // cubeState is a 54 char string: UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB
  // The layout of cubies is 3x3x3 from x,y,z -1 to 1.
  // We need to map facelets to the 27 cubies.
  // For simplicity in this demo, we'll construct the 27 cubies and assign colors based on their position.
  
  const getFaceColor = (char) => COLORS[char] || COLORS.X;

  const cubies = useMemo(() => {
    const arr = [];
    let id = 0;
    
    // Map the 54-char state string (U, R, F, D, L, B) to the 3D faces
    const c = (idx) => getFaceColor(cubeState[idx]);

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          
          let right = COLORS.X, left = COLORS.X, top = COLORS.X;
          let bottom = COLORS.X, front = COLORS.X, back = COLORS.X;
          
          // Approximate visual mapping to the standard 54-char indexing
          if (x === 1) right = c(9 + (1 - y) * 3 + (1 + z));   // R face (9-17)
          if (x === -1) left = c(36 + (1 - y) * 3 + (1 - z));  // L face (36-44)
          if (y === 1) top = c(0 + (1 + z) * 3 + (1 + x));     // U face (0-8)
          if (y === -1) bottom = c(27 + (1 - z) * 3 + (1 + x));// D face (27-35)
          if (z === 1) front = c(18 + (1 - y) * 3 + (1 + x));  // F face (18-26)
          if (z === -1) back = c(45 + (1 - y) * 3 + (1 - x));  // B face (45-53)

          const faces = [right, left, top, bottom, front, back];
          arr.push({ position: [x * 1.05, y * 1.05, z * 1.05], faces, id: id++ });
        }
      }
    }
    return arr;
  }, [cubeState]);

  // Slight continuous rotation for dynamic feel if not actively solving
  useFrame((state, delta) => {
    // group.current.rotation.x += delta * 0.1;
    // group.current.rotation.y += delta * 0.15;
  });

  return (
    <group ref={group} {...props}>
      {cubies.map((cubie) => (
        <mesh key={cubie.id} position={cubie.position}>
          <boxGeometry args={[1, 1, 1]} />
          {cubie.faces.map((color, index) => (
            <meshStandardMaterial attach={`material-${index}`} key={index} color={color} roughness={0.1} metalness={0.1} />
          ))}
        </mesh>
      ))}
    </group>
  );
}
