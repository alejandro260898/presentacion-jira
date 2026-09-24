import { SlideImage, VisualSvg } from "@/components/visuals/slide-frame";

export function WhatVisual() {
  return (
    <SlideImage label="Dos elementos siguen en curso y uno cruza la Definition of Done para volverse incremento">
      <VisualSvg>
        <rect x="28" y="48" width="150" height="72" rx="16" fill="currentColor" fillOpacity="0.06" />
        <rect x="28" y="144" width="150" height="72" rx="16" fill="currentColor" fillOpacity="0.06" />
        <text x="48" y="80" fill="currentColor" fillOpacity="0.55" fontSize="14" fontFamily="sans-serif">
          Elemento
        </text>
        <text x="48" y="104" fill="currentColor" fontSize="16" fontFamily="sans-serif" fontWeight="600">
          En curso
        </text>
        <text x="48" y="176" fill="currentColor" fillOpacity="0.55" fontSize="14" fontFamily="sans-serif">
          Elemento
        </text>
        <text x="48" y="200" fill="currentColor" fontSize="16" fontFamily="sans-serif" fontWeight="600">
          En curso
        </text>
        <line x1="214" y1="36" x2="214" y2="300" stroke="#2684FF" strokeWidth="3" strokeDasharray="7 7" />
        <rect x="178" y="308" width="72" height="28" rx="14" fill="#0052CC" />
        <text x="214" y="327" textAnchor="middle" fill="#fff" fontSize="13" fontFamily="sans-serif" fontWeight="700">
          DoD
        </text>
        <rect x="268" y="96" width="184" height="120" rx="18" fill="#0052CC" />
        <circle cx="308" cy="156" r="18" fill="#fff" fillOpacity="0.18" />
        <path d="M300 156l6 6 12-14" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <text x="338" y="148" fill="#fff" fillOpacity="0.8" fontSize="14" fontFamily="sans-serif">
          Incremento
        </text>
        <text x="338" y="174" fill="#fff" fontSize="18" fontFamily="sans-serif" fontWeight="700">
          Terminado
        </text>
      </VisualSvg>
    </SlideImage>
  );
}
