"use client";

import React, { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';

interface PointData {
  id: string;
  lat: number;
  lng: number;
  amount: number;
  color: string;
  city: string;
}

interface Props {
  pointsData: PointData[];
}

// Firework particle logic
class Firework {
  group: THREE.Group;
  particles: THREE.Points;
  geometry: THREE.BufferGeometry;
  material: THREE.PointsMaterial;
  velocities: Float32Array;
  lifetimes: Float32Array;
  maxLifetime: number = 1.5; // seconds
  age: number = 0;
  
  constructor(origin: THREE.Vector3, color: string, amount: number) {
    this.group = new THREE.Group();
    const particleCount = Math.floor((amount / 200) * 40) + 20;
    
    this.geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    this.velocities = new Float32Array(particleCount * 3);
    this.lifetimes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
      
      // Random velocity in a sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const speed = (Math.random() * 0.5 + 0.2) * (amount / 100);
      
      this.velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      this.velocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
      this.velocities[i * 3 + 2] = Math.cos(phi) * speed;
      
      this.lifetimes[i] = Math.random() * 0.5 + 0.5;
    }
    
    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    this.material = new THREE.PointsMaterial({
      color: new THREE.Color(color),
      size: 0.2,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 1
    });
    
    this.particles = new THREE.Points(this.geometry, this.material);
    this.group.add(this.particles);
    this.group.position.copy(origin);
  }
  
  update(delta: number) {
    this.age += delta;
    const progress = this.age / this.maxLifetime;
    
    const positions = this.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < this.lifetimes.length; i++) {
        // Apply velocity
        positions[i * 3] += this.velocities[i * 3] * delta;
        positions[i * 3 + 1] += this.velocities[i * 3 + 1] * delta;
        positions[i * 3 + 2] += this.velocities[i * 3 + 2] * delta;
        
        // Add gravity/drag
        this.velocities[i * 3 + 1] -= 0.1 * delta; // Slightly fall
        this.velocities[i * 3] *= 0.98; // Drag
        this.velocities[i * 3 + 1] *= 0.98;
        this.velocities[i * 3 + 2] *= 0.98;
    }
    this.geometry.attributes.position.needsUpdate = true;
    this.material.opacity = 1 - progress;
    this.material.size = 0.2 * (1 - progress);
    
    return progress < 1;
  }
}

export default function LiveGlobe({ pointsData }: Props) {
  const globeEl = useRef<any>(null);
  const fireworksRef = useRef<Firework[]>([]);
  const lastTimeRef = useRef(0);
  const [processedIds] = useState(new Set<string>());
  const [countries, setCountries] = useState({ features: [] });

  useEffect(() => {
    // Load country polygons for borders
    fetch('https://unpkg.com/three-globe/example/img/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(setCountries);

    if (globeEl.current) {
      const globe = globeEl.current;
      globe.controls().autoRotate = true;
      globe.controls().autoRotateSpeed = 0.5;
      globe.pointOfView({ lat: 20, lng: 0, altitude: 2.5 });

      // Animation loop for fireworks
      const animate = (time: number) => {
        const delta = (time - lastTimeRef.current) / 1000;
        lastTimeRef.current = time;

        if (delta > 0 && delta < 0.1) {
          fireworksRef.current = fireworksRef.current.filter(fw => {
            const alive = fw.update(delta);
            if (!alive) {
              globe.scene().remove(fw.group);
            }
            return alive;
          });
        }
        requestAnimationFrame(animate);
      };
      const animId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animId);
    }
  }, []);

  // Handle new orders
  useEffect(() => {
    if (!globeEl.current) return;
    const globe = globeEl.current;

    pointsData.forEach(d => {
      if (!processedIds.has(d.id)) {
        processedIds.add(d.id);
        
        // Convert lat/lng to 3D coords
        const altitude = 0.2 + (d.amount / 500);
        const R = 100; // Globe radius constant
        const phi = (90 - d.lat) * (Math.PI / 180);
        const theta = (d.lng + 180) * (Math.PI / 180);
        
        const x = - (R * (1 + altitude )) * Math.sin(phi) * Math.cos(theta);
        const z = (R * (1 + altitude )) * Math.sin(phi) * Math.sin(theta);
        const y = (R * (1 + altitude )) * Math.cos(phi);
        
        // Randomized vibrant colors for fireworks
        const vibrantColors = ['#f43f5e', '#6366f1', '#fbbf24', '#22c55e', '#a855f7', '#06b6d4'];
        const fwColor = vibrantColors[Math.floor(Math.random() * vibrantColors.length)];
        
        const fw = new Firework(new THREE.Vector3(x, y, z), fwColor, d.amount);
        globe.scene().add(fw.group);
        fireworksRef.current.push(fw);

        // Keep set size manageable
        if (processedIds.size > 100) {
            const firstId = processedIds.values().next().value;
            if (firstId) processedIds.delete(firstId);
        }
      }
    });
  }, [pointsData, processedIds]);

  return (
    <Globe
      ref={globeEl}
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
      backgroundColor="rgba(0,0,0,0)"
      width={typeof window !== 'undefined' ? window.innerWidth : 800}
      height={typeof window !== 'undefined' ? window.innerHeight : 600}
      
      // Country Polygons (Borders)
      polygonsData={countries.features}
      polygonCapColor={() => 'rgba(0, 0, 0, 0)'}
      polygonSideColor={() => 'rgba(0, 0, 0, 0.1)'}
      polygonStrokeColor={() => 'rgba(255, 255, 255, 0.1)'}
      
      // Points (Subtle glow at impact site)
      pointsData={pointsData}
      pointLat="lat"
      pointLng="lng"
      pointColor="color"
      pointAltitude={0.01}
      pointRadius={0.2}
      
      // Rings (Expansion wave)
      ringsData={pointsData}
      ringLat="lat"
      ringLng="lng"
      ringColor={() => "#f43f5e"}
      ringMaxRadius={1.5}
      ringPropagationSpeed={2}
      ringRepeatPeriod={2000}
    />
  );
}
