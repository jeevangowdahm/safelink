export default function SeverityBadge({ severity }) {
  const s = (severity || 'LOW').toUpperCase();
  const cls = s === 'CRITICAL' ? 'severity-critical' : s === 'MEDIUM' ? 'severity-medium' : 'severity-low';
  return <span className={`severity-badge ${cls}`}>{s}</span>;
}
