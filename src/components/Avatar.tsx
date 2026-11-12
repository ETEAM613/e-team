export default function Avatar({
  name,
  color,
  size = 96,
  className = "",
}: {
  name: string;
  color: string;
  size?: number;
  className?: string;
}) {
  // Initiales sans les titres (Rav, Rabbanit…)
  const initials = name
    .replace(/^(Rav|Rabbanit)\s+/i, "")
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={`grid shrink-0 place-items-center rounded-2xl font-extrabold text-white ${className}`}
      style={{ width: size, height: size, background: color, fontSize: size * 0.36 }}
      aria-hidden
    >
      {initials}
    </div>
  );
}
