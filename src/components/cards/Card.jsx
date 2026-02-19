import { useMemo, useRef } from "react";
import { CARD, DIM } from "../../config/card.config.js";
import { useCardAnimation, hoverOut } from "../../hooks/useCardAnimation.js";
import { useCardTextures } from "../../hooks/useCardTextures.js";

export default function Card({ index, scatterPos, scatterRot, layout, selectedIndex, setSelectedIndex }) {
    const ref = useRef();

    const isActive = selectedIndex === index;
    const isAnyActive = selectedIndex !== null;
    const isDimmed = isAnyActive && !isActive;
    const { frontMap, backMap } = useCardTextures(index);

    const stackPos = useMemo(() => {
        const z = +0.002 * index;
        const x = 0.01 * index - 0.1;
        return [x, 0, z];
    }, [index]);

    const stackRot = useMemo(() => [0, 0, 0], []);

    const home = useMemo(() => {
        const p = layout === "stack" ? stackPos : scatterPos;
        const r = layout === "stack" ? stackRot : scatterRot;
        return { x: p[0], y: p[1], z: p[2] ?? 0, rotX: r[0], rotY: r[1], rotZ: r[2] };
    }, [layout, stackPos, scatterPos, stackRot, scatterRot]);

    const initialPos = useRef(null);
    if (!initialPos.current) {
        initialPos.current = [home.x, home.y, home.z];
    }

    const initialRot = useRef(null);
    if (!initialRot.current) initialRot.current = [home.rotX, home.rotY, home.rotZ];

    useCardAnimation({ ref, home, isActive, isDimmed, isAnyActive });

    const onPointerDown = (e) => {
        const first = e.intersections?.[0];
        if (!first) return;

        if (first.eventObject !== e.eventObject) return;

        e.stopPropagation();

        if (isAnyActive && !isActive) return;
        setSelectedIndex((cur) => (cur === index ? null : index));
    };

    return (
        <mesh
            ref={ref}
            position={initialPos.current}
            rotation={initialRot.current}
            onPointerDown={onPointerDown}
        >
            <boxGeometry args={CARD.size} />

            {Array.from({ length: 6 }).map((_, i) => (
                <meshStandardMaterial
                    key={i}
                    attach={`material-${i}`}
                    metalness={0}
                    roughness={1}
                    map={(i === 4) ? frontMap : (i === 5) ? backMap : null}
                    transparent={isDimmed}
                    opacity={isDimmed ? DIM.opacity : 1}
                    depthWrite={!isDimmed}
                />
            ))}
        </mesh>
    );
}
