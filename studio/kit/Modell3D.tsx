import React, {useEffect, useMemo, useState} from 'react';
import {useLoader, useThree} from '@react-three/fiber';
import {continueRender, delayRender, staticFile} from 'remotion';
import type {Mesh, Object3D} from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * 3D-Modelle (GLB) in einer <ThreeCanvas>-Szene. Quelle: `studio/public/modelle/…`
 * (z. B. Kenney-Pakete, CC0). `useLoader` lädt jedes Modell einmal; ThreeCanvas wartet
 * per Suspense, bis alles da ist. Pro Verwendung wird geklont.
 */

export type ModellProps = {
  src: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  /** Wirft und empfängt Schatten (Standard an). */
  schatten?: boolean;
};

/** Ein GLB-Modell an einer Stelle der Szene. */
export const Modell: React.FC<ModellProps> = ({src, position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, schatten = true}) => {
  const gltf = useLoader(GLTFLoader, staticFile(src));
  const kopie = useMemo(() => {
    const k = gltf.scene.clone(true);
    k.traverse((o: Object3D) => {
      if ((o as Mesh).isMesh) {
        o.castShadow = schatten;
        o.receiveShadow = schatten;
      }
    });
    return k;
  }, [gltf, schatten]);
  return <primitive object={kopie} position={position} rotation={rotation} scale={scale} />;
};

/**
 * Hält den Render an, bis alle Modelle geladen und einmal gezeichnet sind – sonst fehlt die Welt im ersten Bild.
 * Außerhalb der <ThreeCanvas> aufrufen und `<SzeneBereit handle={…} />` als letztes Kind in die Szene setzen.
 */
export const useSzeneLaden = () => useState(() => delayRender('3D-Szene laden'))[0];

export const SzeneBereit: React.FC<{handle: number}> = ({handle}) => {
  const advance = useThree((s) => s.advance);
  useEffect(() => {
    advance(performance.now());
    const id = requestAnimationFrame(() => continueRender(handle));
    return () => cancelAnimationFrame(id);
  }, [advance, handle]);
  return null;
};
