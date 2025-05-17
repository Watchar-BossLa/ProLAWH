
import { useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useXR, Interactive, Controllers } from "@react-three/xr";
import { Box, Sphere, Text, useTexture } from "@react-three/drei";
import * as THREE from "three";

interface ARObjectProps {
  position: [number, number, number];
  type: string;
  onSelect: () => void;
  isPlaced: boolean;
}

// Individual AR placeable object
function ARObject({ position, type, onSelect, isPlaced }: ARObjectProps) {
  const ref = useRef<THREE.Mesh>(null);

  // Rotate the object slightly for better visibility
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.005;
    }
  });

  // Determine object type and render appropriate 3D model
  const renderARObject = () => {
    const baseProps = {
      ref: ref,
      castShadow: true,
      receiveShadow: true,
    };

    switch (type.toLowerCase()) {
      case "python":
        return (
          <Box args={[1, 1, 1]} {...baseProps}>
            <meshStandardMaterial color={isPlaced ? "#4584b6" : "#306998"} />
          </Box>
        );
      case "kubernetes":
        return (
          <Sphere args={[0.7, 32, 32]} {...baseProps}>
            <meshStandardMaterial color={isPlaced ? "#326de6" : "#2673e4"} />
          </Sphere>
        );
      case "rust":
        return (
          <Box args={[0.8, 0.8, 0.8]} {...baseProps}>
            <meshStandardMaterial color={isPlaced ? "#DEA584" : "#CE412B"} />
          </Box>
        );
      default:
        return (
          <Box args={[0.8, 0.8, 0.8]} {...baseProps}>
            <meshStandardMaterial color={isPlaced ? "#4CAF50" : "#388E3C"} />
          </Box>
        );
    }
  };

  return (
    <Interactive onSelect={onSelect}>
      <group position={position}>
        {renderARObject()}
        <Text
          position={[0, 1.2, 0]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {type}
        </Text>
      </group>
    </Interactive>
  );
}

interface ARSceneProps {
  requiredItems: string[];
  onPlaceObject: (objectType: string) => void;
  placedObjects: string[];
}

export default function ARScene({ requiredItems, onPlaceObject, placedObjects }: ARSceneProps) {
  const { isPresenting } = useXR();

  return (
    <div className="w-full h-[400px] relative">
      <Canvas shadows camera={{ position: [0, 1.5, 3], fov: 75 }}>
        <color attach="background" args={["#171717"]} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} />
        
        {/* Place objects in a circular pattern */}
        {requiredItems.map((item, index) => {
          const angle = (index / requiredItems.length) * Math.PI * 2;
          const radius = 2; 
          const x = Math.sin(angle) * radius;
          const z = Math.cos(angle) * radius;
          const isPlaced = placedObjects.includes(item);
          
          return (
            <ARObject 
              key={item}
              position={[x, 0, z]} 
              type={item}
              onSelect={() => onPlaceObject(item)}
              isPlaced={isPlaced}
            />
          );
        })}

        <Controllers />
      </Canvas>
      
      {/* AR Session Instructions */}
      {isPresenting && (
        <div className="absolute bottom-4 left-0 right-0 text-center bg-black/60 p-2 text-white rounded mx-4">
          <p>Tap on objects to place them in your environment</p>
        </div>
      )}
    </div>
  );
}
