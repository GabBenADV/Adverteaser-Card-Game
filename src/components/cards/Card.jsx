import { useMemo, useRef } from "react";
import { CARD, DIM, FOCUS } from "../../config/card.config.js";
import { useCardAnimation, hoverIn, hoverOut } from "../../hooks/useCardAnimation.js";

export default function Card({ position, index, selectedIndex, setSelectedIndex }) {
    const ref = useRef();

    const isActive = selectedIndex === index;
    const isAnyActive = selectedIndex !== null;
    const isDimmed = isAnyActive && !isActive;

    const home = useMemo(
        () => ({ x: position[0], y: position[1], z: position[2] ?? 0 }),
        [position]
    );

    useCardAnimation({ ref, home, isActive, isDimmed });

    const onClick = () => {
        if (isAnyActive && !isActive) return;
        setSelectedIndex((cur) => (cur === index ? null : index));
    };

    const onOver = () => {
        if (isAnyActive) return;     // prima era: if (isAnyActive && !isActive) return;
        hoverIn(ref, 0.15);
    };

    const onOut = () => {
        if (isAnyActive) return;
        hoverOut(ref, home.z);
    };

    return (
        <mesh
            ref={ref}
            position={[home.x, home.y, home.z]}
            onClick={onClick}
            onPointerOver={onOver}
            onPointerOut={onOut}
        >
            <boxGeometry args={CARD.size} />

            {Array.from({ length: 6 }).map((_, i) => (
                <meshStandardMaterial
                    key={i}
                    attach={`material-${i}`}
                    metalness={0}
                    roughness={1}
                    transparent={isDimmed}
                    opacity={isDimmed ? DIM.opacity : 1}
                    depthWrite={!isDimmed}
                />
            ))}
        </mesh>
    );
}
