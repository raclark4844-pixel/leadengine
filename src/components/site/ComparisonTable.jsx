export default function ComparisonTable() {
  const rows = [
    ['Strategy', 'One plan tied to the sales process', 'Usually limited to site scope', 'Split across vendors and subscriptions'],
    ['Website & landing pages', 'Built as the conversion hub', 'Included', 'Often separate'],
    ['SEO, GEO, AEO & CRO', 'Designed together from the start', 'May be an add-on', 'Handled in separate tools'],
    ['Content & social', 'Connected to campaigns and destinations', 'Usually separate', 'Scheduled without a shared funnel'],
    ['Lead capture & routing', 'Qualified, tracked, and handed off', 'Basic forms', 'Multiple disconnected handoffs'],
    ['Analytics', 'Shared measurement across the journey', 'Page-level reporting', 'Data stays in separate dashboards'],
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] border-separate border-spacing-0 text-sm">
        <thead>
          <tr className="text-left">
            <th className="border-b border-line pb-3 pr-4 font-display font-bold">Capability</th>
            <th className="border-b border-line pb-3 pr-4 font-display font-bold text-volt">Custom AI-assisted platform</th>
            <th className="border-b border-line pb-3 pr-4 font-display font-bold text-muted-foreground">Standalone website</th>
            <th className="border-b border-line pb-3 font-display font-bold text-muted-foreground">Disconnected tools</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]} className="align-top">
              <td className="border-b border-line/70 py-4 pr-4 font-medium">{row[0]}</td>
              <td className="border-b border-line/70 py-4 pr-4 text-foreground/90">{row[1]}</td>
              <td className="border-b border-line/70 py-4 pr-4 text-muted-foreground">{row[2]}</td>
              <td className="border-b border-line/70 py-4 text-muted-foreground">{row[3]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}