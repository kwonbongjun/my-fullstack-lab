"use client";

import { useLabStore } from "@/store/useLabStore";
import { RigidBody, RapierRigidBody, CuboidCollider } from "@react-three/rapier";
import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text } from "@react-three/drei";

export default function ActionReactionScene() {
  const { mass, appliedForce, finishReset, isResetting, resetCount } = useLabStore();

  const bodyARef = useRef<RapierRigidBody>(null);
  const bodyBRef = useRef<RapierRigidBody>(null);
  const [showCollisionUI, setShowCollisionUI] = useState(false);
  const hasCollidedRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scaleA = Math.pow(mass, 1/3);

  const isAppliedRef = useRef(false);

  // 물리 엔진의 API를 직접 사용하여 위치와 속도를 리셋하는 함수
  const resetPhysicsStates = () => {
    hasCollidedRef.current = false;
    isAppliedRef.current = false;
    setShowCollisionUI(false);
    
    if (bodyARef.current) {
      bodyARef.current.setTranslation({ x: -5, y: scaleA / 2, z: 0 }, true);
      bodyARef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      bodyARef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
      bodyARef.current.resetForces(true);
      bodyARef.current.resetTorques(true);
      bodyARef.current.setLinearDamping(0.2); 
    }
    if (bodyBRef.current) {
      bodyBRef.current.setTranslation({ x: 1, y: 0.5, z: 0 }, true);
      bodyBRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      bodyBRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
      bodyBRef.current.resetForces(true);
      bodyBRef.current.resetTorques(true);
      bodyBRef.current.setLinearDamping(0.2);
    }
  };

  // 슬라이더 조절(mass, force)이나 초기화 버튼(resetCount) 클릭 시 즉시 리셋 실행
  useEffect(() => {
    resetPhysicsStates();
  }, [mass, appliedForce, resetCount, scaleA]);

  useFrame(() => {
    // 처음에 한 번만 충격량을 주어 등속도에 가깝게 이동하게 함
    if (bodyARef.current && appliedForce > 0 && !isAppliedRef.current) {
      // 충격량(Impulse)을 사용하여 초기 속도 부여
      bodyARef.current.applyImpulse({ x: appliedForce * 0.5, y: 0, z: 0 }, true);
      isAppliedRef.current = true;
    }
  });

  const handleCollision = (payload: any) => {
    if (hasCollidedRef.current) return;
    
    const other = payload.other.rigidBody;
    if (!other || other.bodyType() === 0) return;

    hasCollidedRef.current = true;
    setShowCollisionUI(true);
    
    // 충돌 후 자연스러운 감속을 위해 damping 약간 증가
    if (bodyARef.current) {
      bodyARef.current.setLinearDamping(1.5); 
    }
    if (bodyBRef.current) {
      bodyBRef.current.setLinearDamping(1.5);
    }
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShowCollisionUI(false), 3000);
  };

  useEffect(() => {
    if (isResetting) {
      finishReset();
    }
  }, [isResetting, finishReset]);

  return (
    <>
      <RigidBody type="fixed" friction={0.1} restitution={0.5}>
        <mesh receiveShadow position={[0, -0.5, 0]}>
          <boxGeometry args={[100, 1, 100]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      </RigidBody>

      <RigidBody
        ref={bodyARef}
        position={[-5, scaleA / 2, 0]}
        restitution={0.5}
        friction={0.1}
        linearDamping={0.2}
        enabledRotations={[false, false, false]} 
        ccd={true}
        colliders={false}
        onCollisionEnter={handleCollision}
      >
        <CuboidCollider args={[scaleA / 2, scaleA / 2, scaleA / 2]} mass={mass} friction={0.1} restitution={0.5} />
        <mesh castShadow>
          <boxGeometry args={[scaleA, scaleA, scaleA]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
        <Text position={[0, scaleA / 2 + 0.4, 0]} fontSize={0.25} color="white" fontWeight="bold">
          {`A (${mass.toFixed(1)}kg)`}
        </Text>
        
        {showCollisionUI && (
          <group position={[0, 0, 0]}>
            <primitive object={new THREE.ArrowHelper(new THREE.Vector3(-1, 0, 0), new THREE.Vector3(-scaleA/2, 0, 0), 1.5, 0xffaa00, 0.4, 0.2)} />
            <Text position={[-1.2, scaleA/2 + 0.1, 0]} fontSize={0.2} color="#ffaa00">반작용 (-F)</Text>
          </group>
        )}
      </RigidBody>

      <RigidBody
        ref={bodyBRef}
        position={[1, 0.5, 0]}
        restitution={0.5}
        friction={0.1}
        linearDamping={0.2}
        enabledRotations={[false, false, false]} 
        ccd={true}
        colliders={false}
      >
        <CuboidCollider args={[0.5, 0.5, 0.5]} mass={1.0} friction={0.1} restitution={0.5} />
        <mesh castShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#10b981" />
        </mesh>
        <Text position={[0, 0.9, 0]} fontSize={0.25} color="white" fontWeight="bold">B (1.0kg)</Text>
        
        {showCollisionUI && (
          <group position={[0, 0, 0]}>
            <primitive object={new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0.5, 0, 0), 1.5, 0x00f2ff, 0.4, 0.2)} />
            <Text position={[1.2, 0.6, 0]} fontSize={0.2} color="#00f2ff">작용 (F)</Text>
          </group>
        )}
      </RigidBody>

      {/* Instructional UI */}
      {showCollisionUI && (
        <group position={[0, 3, 0]}>
          <Text fontSize={0.4} color="yellow" outlineWidth={0.02} fontWeight="bold">
            F_ab = -F_ba
          </Text>
          <Text position={[0, -0.4, 0]} fontSize={0.2} color="#e2e8f0" maxWidth={4} textAlign="center">
            "모든 작용에 대해 크기가 같고 방향이 반대인 반작용이 존재한다"
          </Text>
        </group>
      )}
    </>
  );
}
