'use client';

export default function BaroqueWings({ color = '#c5a25a', width = 320, flip = false }) {
  return (
    <svg
      viewBox="0 0 320 160"
      width={width}
      style={{ transform: flip ? 'scaleX(-1)' : undefined, overflow: 'visible' }}
      fill="none"
    >
      {/* Main sweeping arm */}
      <path d="M160,80 C130,75 100,65 75,50 C50,35 30,20 15,10"
        stroke={color} strokeWidth="1.5" opacity="0.9"/>
      <path d="M160,80 C130,85 100,90 72,82 C44,74 25,58 12,42"
        stroke={color} strokeWidth="1.2" opacity="0.8"/>

      {/* Upper secondary sweep */}
      <path d="M130,70 C110,60 90,48 70,38 C55,30 38,22 22,18"
        stroke={color} strokeWidth="0.9" opacity="0.7"/>

      {/* Curling tips */}
      <path d="M15,10 C8,5 5,12 10,16 C15,20 20,14 15,10"
        stroke={color} strokeWidth="1.2" opacity="0.9"/>
      <path d="M12,42 C5,42 3,50 10,52 C17,54 18,45 12,42"
        stroke={color} strokeWidth="1" opacity="0.8"/>
      <path d="M22,18 C15,16 12,23 18,26 C24,29 26,20 22,18"
        stroke={color} strokeWidth="0.9" opacity="0.7"/>

      {/* Inner decorative scroll */}
      <path d="M155,78 C145,72 135,65 125,60 C118,56 110,55 108,62 C106,69 114,74 122,70 C130,66 128,58 120,56"
        stroke={color} strokeWidth="0.9" opacity="0.75"/>

      {/* Middle branch */}
      <path d="M140,76 C120,68 100,60 82,56 C70,53 60,56 58,64 C56,72 66,76 76,72"
        stroke={color} strokeWidth="0.8" opacity="0.65"/>

      {/* Leaf-like flourishes along arm */}
      <path d="M100,65 C95,58 92,63 97,67 C102,71 104,64 100,65"
        stroke={color} strokeWidth="0.8" fill={color} fillOpacity="0.15" opacity="0.8"/>
      <path d="M70,50 C65,43 62,48 67,52 C72,56 74,49 70,50"
        stroke={color} strokeWidth="0.8" fill={color} fillOpacity="0.15" opacity="0.8"/>
      <path d="M45,35 C40,28 37,33 42,37 C47,41 49,34 45,35"
        stroke={color} strokeWidth="0.8" fill={color} fillOpacity="0.12" opacity="0.7"/>

      {/* Lower flourish */}
      <path d="M155,82 C135,90 110,95 88,90 C72,87 62,78 65,68"
        stroke={color} strokeWidth="0.8" opacity="0.6"/>
      <path d="M65,68 C64,62 70,59 76,63 C82,67 80,74 74,74"
        stroke={color} strokeWidth="0.8" opacity="0.6"/>

      {/* Small dot accents */}
      <circle cx="15" cy="10" r="2" fill={color} opacity="0.6"/>
      <circle cx="12" cy="42" r="1.5" fill={color} opacity="0.5"/>
      <circle cx="22" cy="18" r="1.5" fill={color} opacity="0.5"/>
    </svg>
  );
}
