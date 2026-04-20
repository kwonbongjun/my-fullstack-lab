"use client";

import { useLabStore } from "@/store/useLabStore";
import {
  RigidBody,
  RapierRigidBody,
  CuboidCollider,
} from "@react-three/rapier";
import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text } from "@react-three/drei";

export default function FmaScene() {
  const { mass, appliedForce, isResetting, finishReset } = useLabStore();
  const cubeRef = useRef<RapierRigidBody>(null);

  const dir = useMemo(() => new THREE.Vector3(1, 0, 0), []);
  const scale = Math.pow(mass, 1 / 3);

  useFrame(() => {
    if (cubeRef.current && appliedForce > 0) {
      cubeRef.current.addForce({ x: appliedForce * 1.5, y: 0, z: 0 }, true);
    }
  });

  useEffect(() => {
    if (isResetting) finishReset();
  }, [isResetting, finishReset]);

  return (
    <>
      <RigidBody type="fixed" friction={0} restitution={0}>
        <mesh receiveShadow position={[0, -0.5, 0]}>
          <boxGeometry args={[100, 1, 100]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      </RigidBody>

      <RigidBody
        key={`cube-m-${mass}-f-${appliedForce}-r`}
        ref={cubeRef}
        colliders={false}
        position={[0, scale / 2, 0]}
        restitution={0}
        friction={0}
        linearDamping={0.1}
        angularDamping={0.1}
        canSleep={false}
      >
        <CuboidCollider args={[scale / 2, scale / 2, scale / 2]} mass={mass} />
        <mesh castShadow>
          <boxGeometry args={[scale, scale, scale]} />
          <meshStandardMaterial color="#3b82f6" />
        </mesh>

        {/* Force Visualizer */}
        {appliedForce > 0 && (
          <group position={[0, scale / 2 + 0.1, 0]}>
            <primitive
              object={
                new THREE.ArrowHelper(
                  dir,
                  new THREE.Vector3(-scale / 2, 0, 0),
                  appliedForce * 0.05 + 0.5,
                  0xff0000,
                  0.2,
                  0.1,
                )
              }
            />
            <Text position={[0, 0.4, 0]} fontSize={0.2} color="white">
              {appliedForce} N
            </Text>
          </group>
        )}
      </RigidBody>
    </>
  );
}
