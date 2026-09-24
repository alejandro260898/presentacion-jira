import { SlideImage, VisualSvg } from "@/components/visuals/slide-frame";

export function IncompleteVisual() {
  return (
    <SlideImage label="El trabajo que no cumple no se publica y regresa al Product Backlog">
      <VisualSvg>
        <rect x="28" y="36" width="190" height="120" rx="18" fill="currentColor" fillOpacity="0.06" />
        <path d="M52 60l28 28M80 60 52 88" fill="none" stroke="#b65c02" strokeWidth="3" strokeLinecap="round" />
        <text x="100" y="86" fill="currentColor" fontSize="16" fontFamily="sans-serif" fontWeight="700">
          No se
        </text>
        <text x="100" y="110" fill="currentColor" fontSize="16" fontFamily="sans-serif" fontWeight="700">
          publica
        </text>
        <path d="M230 96h48" stroke="#2684FF" strokeWidth="2.5" />
        <path d="M268 88l12 8-12 8" fill="none" stroke="#2684FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="292" y="36" width="160" height="120" rx="18" fill="#0052CC" />
        <text x="372" y="92" textAnchor="middle" fill="#fff" fontSize="16" fontFamily="sans-serif" fontWeight="700">
          Backlog
        </text>
        <text x="372" y="116" textAnchor="middle" fill="#fff" fillOpacity="0.8" fontSize="13" fontFamily="sans-serif">
          se retoma
        </text>
        <rect x="28" y="200" width="424" height="112" rx="18" fill="currentColor" fillOpacity="0.05" />
        <text x="240" y="252" textAnchor="middle" fill="currentColor" fontSize="18" fontFamily="sans-serif" fontWeight="700">
          No es parte de lo entregado
        </text>
        <text x="240" y="278" textAnchor="middle" fill="currentColor" fillOpacity="0.6" fontSize="14" fontFamily="sans-serif">
          Tampoco se enseña como terminado
        </text>
      </VisualSvg>
    </SlideImage>
  );
}
