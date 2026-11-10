import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { ChevronDown, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';

function buildPdf(review) {
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
  write(review.kind === 'comparison' ? 'Website comparison' : 'Website improvement review', 13, true, '#444444');
  write(`Website: ${review.url}`, 11);
  write(`Readiness score: ${review.score}/100`, 11, true);
  y += 6;
  write(review.summary, 11);
  y += 8;
  (review.findings || []).forEach((item) => write(`- ${item.label} (${item.status}): ${item.detail}`, 11));
  y += 8;
  (review.recommendations || []).forEach((item) => write(`- ${item.area} - ${item.title}: ${item.detail}`, 11));
  y += 10;
  write('Public website signals only. No traffic, rankings, revenue, or lead numbers are inferred.', 9, false, '#6b7280');
  doc.save(`demore-review-${(review.url || 'site').replace(/^https?:\/\//, '').replace(/[^a-z0-9.-]/gi, '')}.pdf`);
}

export default function ReviewsPanel() {
  const [reviews, setReviews] = useState(null);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    let active = true;
    base44.entities.WebsiteReview.filter({}, { sort: '-created_date', limit: 50 })
      .then((page) => active && setReviews(page?.items || []))
      .catch(() => active && setReviews([]));
    return () => {
      active = false;
    };
  }, []);

  if (reviews === null) return <div className="panel p-8 text-sm text-muted-foreground">Loading reviews…</div>;

  if (reviews.length === 0) {
    return (
      <div className="panel p-8 text-sm text-muted-foreground">
        No reviews yet. Every website review and comparison run from the site lands here with the findings and the contact
        details.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <article key={review.id} className="panel p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <span className="kicker">{review.kind === 'comparison' ? 'Comparison' : 'Improvement review'}</span>
              <h3 className="mt-2 font-display text-base font-bold">{review.url}</h3>
              <p className="mt-1 text-xs text-faint">
                {[review.full_name, review.company, review.email, review.phone, review.target_city]
                  .filter(Boolean)
                  .join(' · ') || 'No contact details submitted'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-display text-2xl font-extrabold text-volt">{review.score}</span>
              <button
                type="button"
                onClick={() => buildPdf(review)}
                className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <Download size={13} />
                PDF
              </button>
            </div>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{review.summary}</p>

          <button
            type="button"
            onClick={() => setOpenId(openId === review.id ? null : review.id)}
            className="mt-4 inline-flex items-center gap-1.5 text-sm text-volt hover:underline"
          >
            <ChevronDown size={15} className={openId === review.id ? 'rotate-180 transition-transform' : 'transition-transform'} />
            {openId === review.id ? 'Hide findings' : 'Show findings and recommendations'}
          </button>

          {openId === review.id && (
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-faint">Findings</p>
                <ul className="mt-3 space-y-2.5">
                  {(review.findings || []).map((finding, index) => (
                    <li key={index} className="text-sm">
                      <span className="font-medium">{finding.label}</span>
                      <span className="ml-2 text-xs uppercase tracking-[0.1em] text-faint">{finding.status}</span>
                      <p className="mt-1 text-muted-foreground">{finding.detail}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-faint">Recommendations</p>
                <ul className="mt-3 space-y-2.5">
                  {(review.recommendations || []).map((item, index) => (
                    <li key={index} className="text-sm">
                      <span className="text-volt">{item.area}</span>
                      <p className="font-medium">{item.title}</p>
                      <p className="mt-1 text-muted-foreground">{item.detail}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}