export default function Avatar({
  name,
  gradient,
  size = 96,
  online = false,
  className = "",
}: {
  name: string;
  gradient: string;
  size?: number;
  online?: boolean;
  className?: string;
}) {
  const initials = name
    .replace(/^(Rav|Rabbanit)\s+/i, "")
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: size, height: size }} aria-hidden>
      <div
        className={`grid h-full w-full place-items-center rounded-[28%] bg-gradient-to-br font-extrabold text-white ${gradient}`}
        style={{ fontSize: size * 0.34 }}
      >
        <span className="font-display">{initials}</span>
      </div>
      {online && (
        <span
          className="absolute rounded-full border-[3px] border-white bg-emerald-500"
          style={{ width: size * 0.24, height: size * 0.24, right: -size * 0.03, bottom: -size * 0.03 }}
        />
      )}
    </div>
  );
}
