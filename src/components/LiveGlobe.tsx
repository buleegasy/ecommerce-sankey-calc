"use client";

import React, { useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';

interface PointData {
  lat: number;
  lng: number;
  size: number;
  color: string;
}

interface Props {
  pointsData: PointData[];
}

export default function LiveGlobe({ pointsData }: Props) {
  const globeEl = useRef<any>(null);

  useEffect(() => {
    if (globeEl.current) {
      // Auto-rotation
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
      
      // Point the camera to a decent starting position
      globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 2.5 });
    }
  }, []);

  return (
    <Globe
      ref={globeEl}
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
      backgroundColor="rgba(0,0,0,0)"
      width={typeof window !== 'undefined' ? window.innerWidth : 800}
      height={typeof window !== 'undefined' ? window.innerHeight : 600}
      
      // Points (Orders)
      pointsData={pointsData}
      pointLat="lat"
      pointLng="lng"
      pointColor="color"
      pointAltitude={0.1}
      pointRadius="size"
      pointsMerge={true}
      
      // Rings (Pulsating effect)
      ringsData={pointsData}
      ringLat="lat"
      ringLng="lng"
      ringColor={() => "#f43f5e"}
      ringMaxRadius={2}
      ringPropagationSpeed={3}
      ringRepeatPeriod={1000}
    />
  );
}
