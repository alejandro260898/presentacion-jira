import { SlideImage, VisualSvg } from "@/components/visuals/slide-frame";

export function DifferencesVisual() {
  return (
    <SlideImage label="Tres momentos distintos: listo para empezar, el pedido de un elemento y la calidad de todos">
      <VisualSvg>
        <rect x="24" y="28" width="432" height="88" rx="16" fill="none" stroke="currentColor" strokeOpacity="0.28" strokeDasharray="6 6" />
        <text x="44" y="62" fill="currentColor" fontSize="16" fontFamily="sans-serif" fontWeight="700">
          Ready
        </text>
        <text x="44" y="86" fill="currentColor" fillOpacity="0.6" fontSize="14" fontFamily="sans-serif">
          Opcional · para empezar
        </text>
        <rect x="24" y="132" width="200" height="88" rx="16" fill="#2684FF" fillOpacity="0.16" />
        <text x="44" y="166" fill="#0052CC" fontSize="16" fontFamily="sans-serif" fontWeight="700">
          Este elemento
        </text>
        <text x="44" y="190" fill="currentColor" fillOpacity="0.7" fontSize="14" fontFamily="sans-serif">
          Filtrar por fecha
        </text>
        <rect x="24" y="236" width="432" height="96" rx="16" fill="#0052CC" />
        <text x="44" y="272" fill="#fff" fontSize="16" fontFamily="sans-serif" fontWeight="700">
          Todos los incrementos
        </text>
        <text x="44" y="298" fill="#fff" fillOpacity="0.85" fontSize="14" fontFamily="sans-serif">
          Probado · revisado · integrado
        </text>
      </VisualSvg>
    </SlideImage>
  );
}
