import { jsPDF } from 'jspdf';
import { Download, CheckCircle2, AlertTriangle, Search } from 'lucide-react';

const STATUS_STYLE = {
  detected: { className: 'border-volt/40 text-volt', label: 'Working' },
  missing: { className: 'border-hot/40 text-hot', label: 'Not found' },
  review: { className: 'border-line text-muted-foreground', label: 'Needs a check' },
};

function statusFor(value) {
  const key = String(value || '').toLowerCase();
  if (STATUS_STYLE[key]) return STATUS_STYLE[key];
  return STATUS_STYLE.review;
}

function downloadPdf(result) {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const margin = 54;
  const width = 612 - margin * 2;
  let y = margin;

  const write = (text, size = 11, bold = false, color = '#111111') => {
    doc.setFontSize(size);
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setTextColor(color);
    doc.splitTextToSize(String(text || ''), width).forEach((line) => {
      if (y > 730) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += size + 4;
    });
  };

  write('Demore Technology Solutions', 16, true);
  write(result.kind === 'comparison' ? 'Website comparison summary' : 'Website improvement review', 13, true, '#444444');
  write(new Date().toLocaleDateString(), 10, false, '#6b7280');
  y += 8;
  write(`Website reviewed: ${result.url}`, 11);
  if (result.target_city) write(`Target market: ${result.target_city}`, 11);
  write(`Readiness score: ${result.score}/100`, 12, true);
  y += 6;
  write(result.summary, 11);
  y += 10;
  write('Findings', 13, true);
  (result.findings || []).forEach((finding) => {
    write(`- ${finding.label} [${finding.status}]: ${finding.detail}`, 11);
  });
  y += 10;
  write('Recommendations', 13, true);
  (result.recommendations || []).forEach((item) => {
    write(`- ${item.area} - ${item.title}: ${item.detail}`, 11);
  });
  if (result.competitor_notes?.length) {
    y += 10;
    write('Competitors', 13, true);
    result.competitor_notes.forEach((note) => write(`- ${note.name}: ${note.note}`, 11));
  }
  y += 12;
  write(
    'Prepared by Demore Technology Solutions. This review reads public website signals only. It does not measure live traffic, rankings, AI citations, or revenue, and no result is guaranteed.',
    9,
    false,
    '#6b7280'
  );

  doc.save('demore-website-review.pdf');
}

export default function ReviewResults({ result }) {
  if (!result) return null;

  return (
    <div className="panel p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="kicker">{result.kind === 'comparison' ? 'Comparison summary' : 'Improvement review'}</span>
          <h3 className="mt-3 font-display text-xl font-bold sm:text-2xl">{result.url}</h3>
          {result.target_city && <p className="mt-1 text-sm text-faint">Target market: {result.target_city}</p>}
        </div>
        <div className="text-right">
          <span className="font-display text-4xl font-extrabold text-volt">{result.score}</span>
          <p className="text-xs uppercase tracking-[0.18em] text-faint">readiness / 100</p>
        </div>
      </div>

      <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">{result.summary}</p>

      <div className="mt-8">
        <h4 className="font-display text-base font-bold">Findings</h4>
        <ul className="mt-4 space-y-3">
          {(result.findings || []).map((finding, index) => {
            const style = statusFor(finding.status);
            const Icon = finding.status === 'detected' ? CheckCircle2 : finding.status === 'missing' ? AlertTriangle : Search;
            return (
              <li key={`${finding.label}-${index}`} className="flex gap-3">
                <Icon size={17} className="mt-0.5 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-sm font-semibold">
                    {finding.label} <span className={`ml-2 rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] ${style.className}`}>{style.label}</span>
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{finding.detail}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-8">
        <h4 className="font-display text-base font-bold">Recommendations</h4>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {(result.recommendations || []).map((item, index) => (
            <div key={`${item.title}-${index}`} className="panel-raised p-4">
              <span className="text-[11px] uppercase tracking-[0.16em] text-volt">{item.area}</span>
              <p className="mt-2 text-sm font-semibold">{item.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {result.competitor_notes?.length > 0 && (
        <div className="mt-8">
          <h4 className="font-display text-base font-bold">Competitors</h4>
          <ul className="mt-4 space-y-3">
            {result.competitor_notes.map((note, index) => (
              <li key={`${note.name}-${index}`} className="panel p-4">
                <p className="text-sm font-semibold">{note.name}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{note.note}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => downloadPdf(result)} className="btn-volt">
          <Download size={16} />
          Download the PDF
        </button>
        <p className="text-xs text-faint">
          Public website signals only. No traffic, rankings, revenue, or lead numbers are inferred.
        </p>
      </div>
    </div>
  );
}