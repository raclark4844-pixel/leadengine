function money(value) {
  return '$' + Number(value).toLocaleString();
}

function year(value) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.getFullYear();
}

export default function PropertyFacts({ record }) {
  if (!record) return null;
  const building = record.building || {};
  const general = record.general || {};
  const intel = record.intel || {};
  const lastDeed = Array.isArray(record.deedHistory) ? record.deedHistory[0] : null;

  const beds = building.bedroomCount;
  const baths = building.bathroomCount;

  const facts = [
    { label: 'Type', value: general.propertyTypeDetail || general.propertyTypeCategory },
    { label: 'Year built', value: building.yearBuilt },
    {
      label: 'Beds / baths',
      value: beds || baths ? `${beds ?? '—'} / ${baths ?? '—'}` : null,
    },
    {
      label: 'Living area',
      value: building.livingAreaSquareFeet ? `${building.livingAreaSquareFeet.toLocaleString()} sq ft` : null,
    },
    {
      label: 'Last sale',
      value: lastDeed?.salePrice
        ? `${money(lastDeed.salePrice)}${year(lastDeed.saleDate) ? ` in ${year(lastDeed.saleDate)}` : ''}`
        : null,
    },
    {
      label: 'Sale propensity',
      value: typeof intel.salePropensity === 'number' ? `${intel.salePropensity}%` : null,
    },
  ].filter((fact) => fact.value);

  if (!facts.length) return null;

  return (
    <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-line pt-4 sm:grid-cols-3 lg:grid-cols-6">
      {facts.map((fact) => (
        <div key={fact.label}>
          <dt className="text-[0.6875rem] uppercase tracking-[0.14em] text-faint">{fact.label}</dt>
          <dd className="mt-1 text-sm text-foreground">{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}