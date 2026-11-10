export default function Orbs() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="orb -left-24 -top-16 h-72 w-72 bg-volt/20" />
      <div className="orb -right-16 top-24 h-64 w-64 bg-hot/15" style={{ animationDelay: '2.5s' }} />
      <div className="orb -bottom-24 left-1/3 h-72 w-72 bg-flare/10" style={{ animationDelay: '5s' }} />
    </div>
  );
}