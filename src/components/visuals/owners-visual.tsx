import { SlideImage, VisualSvg } from "@/components/visuals/slide-frame";

export function OwnersVisual() {
  return (
    <SlideImage label="La organización pone el mínimo, el equipo lo cumple y la retrospectiva lo revisa">
      <VisualSvg>
        <rect x="140" y="24" width="200" height="64" rx="16" fill="#0052CC" />
        <text x="240" y="62" textAnchor="middle" fill="#fff" fontSize="16" fontFamily="sans-serif" fontWeight="700">
          Mínimo común
        </text>
        <path d="M240 88v28" stroke="#2684FF" strokeWidth="2.5" />
        <path d="M232 108l8 10 8-10" fill="none" stroke="#2684FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="150" cy="190" r="36" fill="#2684FF" fillOpacity="0.2" />
        <circle cx="240" cy="190" r="36" fill="#0052CC" />
        <circle cx="330" cy="190" r="36" fill="#2684FF" fillOpacity="0.2" />
        <text x="240" y="196" textAnchor="middle" fill="#fff" fontSize="14" fontFamily="sans-serif" fontWeight="700">
          Equipo
        </text>
        <rect x="110" y="258" width="260" height="64" rx="16" fill="currentColor" fillOpacity="0.06" />
        <text x="240" y="296" textAnchor="middle" fill="currentColor" fontSize="16" fontFamily="sans-serif" fontWeight="700">
          Se revisa en la retro
        </text>
      </VisualSvg>
    </SlideImage>
  );
}
