import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export default function Stage({ children, controlsEnabled }) {
  return (
    <div style={{ width: "100%", height: "100dvh" }}>
      <Canvas
        camera={{ position: [0, 0, 9], fov: 45 }}
        dpr={1}
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 6, 5]} intensity={1.3} />

        {children}
      </Canvas>
    </div>
  );
}
