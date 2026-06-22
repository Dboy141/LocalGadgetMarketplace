export default function StatCard({ label, value }) {
  return (
    <div className="statCard">
      <p>{label}</p>
      <h2>{value}</h2>
    </div>
  );
}
