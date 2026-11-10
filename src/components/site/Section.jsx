export default function Section({ id, kicker, title, lead, children, className = '', width = 'max-w-6xl' }) {
  return (
    <section id={id} className={`border-b border-line ${className}`}>
      <div className={`mx-auto ${width} px-5 py-16 sm:px-8 sm:py-24`}>
        {(kicker || title) && (
          <header className="max-w-3xl">
            {kicker && <span className="kicker">{kicker}</span>}
            {title && (
              <h2 className="mt-4 font-display text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl lg:text-5xl">
                {title}
              </h2>
            )}
            {lead && <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">{lead}</p>}
          </header>
        )}
        {children && <div className="mt-12">{children}</div>}
      </div>
    </section>
  );
}