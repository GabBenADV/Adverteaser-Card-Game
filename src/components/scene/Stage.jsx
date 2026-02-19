import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export default function Stage({ children, controlsEnabled }) {
  return (
    <div style={{ width: "100%", height: "calc(100vh - 150px)" }}>
      <h2>
        Le opportunità si colgono meglio insieme. Gli imprevisti non si superano con una campagna. <br />
        Servono competenze, struttura, regia, allenamento continuo. Serve qualcuno che giochi con te.<br />
        Scegli una carta. Opportunità o Imprevisto, scopri come Adverteaser rende possibile gestire entrambe le situazioni.
      </h2>
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
