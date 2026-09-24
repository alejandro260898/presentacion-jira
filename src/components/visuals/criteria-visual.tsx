import { SlideImage, VisualSvg } from "@/components/visuals/slide-frame";

const checks = [
  ["Requerimientos", 100],
  ["Pruebas", 142],
  ["Evidencia", 184],
  ["Código", 226],
  ["Visto bueno", 268],
] as const;

const docs = ["Nota", "Captura", "Cambio", "Changelog"];

export function CriteriaVisual() {
  return (
    <SlideImage label="Lista de calidad del equipo y la documentación mínima que la acompaña">
      <VisualSvg>
        <rect x="28" y="28" width="250" height="304" rx="18" fill="currentColor" fillOpacity="0.05" />
        <text x="48" y="64" fill="currentColor" fontSize="16" fontFamily="sans-serif" fontWeight="700">
          Nuestra DoD
        </text>
        {checks.map(([label, y]) => (
          <g key={label}>
            <circle cx="58" cy={y - 4} r="9" fill="#0052CC" />
            <path d={`M53 ${y - 4}l3.2 3.2 6.4-7`} fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" />
            <text x="78" y={y} fill="currentColor" fontSize="15" fontFamily="sans-serif">
              {label}
            </text>
          </g>
        ))}
        <rect x="298" y="28" width="154" height="304" rx="18" fill="#0052CC" />
        <text x="318" y="68" fill="#fff" fontSize="15" fontFamily="sans-serif" fontWeight="700">
          Docs
        </text>
        <text x="318" y="90" fill="#fff" fillOpacity="0.75" fontSize="13" fontFamily="sans-serif">
          mínimas
        </text>
        {docs.map((label, index) => (
          <g key={label}>
            <rect x="318" y={118 + index * 46} width="114" height="34" rx="8" fill="#fff" fillOpacity="0.14" />
            <text x="332" y={140 + index * 46} fill="#fff" fontSize="14" fontFamily="sans-serif">
              {label}
            </text>
          </g>
        ))}
      </VisualSvg>
    </SlideImage>
  );
}
