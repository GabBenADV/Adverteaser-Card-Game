import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";

export default function Stage({ children, controlsEnabled }) {
  return (
    <div style={{ width: "100%", height: "100vh", overflow: "hidden" }}>
      <Canvas
        shadows
        camera={{ position: [0, 0, 9], fov: 45 }}
        dpr={1}
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.35} />
        <directionalLight castShadow
          position={[6, 5, 6]}
          intensity={1.2}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0002}
        />
        <directionalLight position={[-6, 1, 4]} intensity={0.75} />

        <Environment preset="forest" />

        {children}

        <ContactShadows position={[0, -5, 0]}
          opacity={0.35}
          blur={2.8}
          far={8}
        />
      </Canvas>
    </div>
  );
}
