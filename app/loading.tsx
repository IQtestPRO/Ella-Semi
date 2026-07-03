/**
 * Loading global — skeleton warm da marca enquanto as páginas force-dynamic
 * buscam do Turso. Shimmer sutil (≤300ms por ciclo visual seria frenético;
 * 1.8s de ciclo com easing suave lê como respiração, não como spinner).
 */
export default function Loading() {
  return (
    <div
      aria-busy="true"
      aria-label="Carregando"
      className="min-h-screen w-full"
      style={{ backgroundColor: "var(--color-salmao)" }}
    >
      {/* Header fantasma */}
      <div className="flex items-center justify-center px-5 py-4 md:px-10">
        <div className="ella-shimmer h-14 w-14 rounded-full md:h-16 md:w-16" />
      </div>

      {/* Hero fantasma */}
      <div
        className="ella-shimmer w-full"
        style={{ height: "clamp(40vh, 56vh, 620px)" }}
      />

      {/* Cards fantasmas */}
      <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-4 px-5 py-16 md:grid-cols-4 md:gap-6 md:px-10">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div
              className="ella-shimmer w-full"
              style={{ aspectRatio: "4 / 5" }}
            />
            <div className="ella-shimmer h-4 w-3/4 rounded" />
            <div className="ella-shimmer h-4 w-1/3 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
