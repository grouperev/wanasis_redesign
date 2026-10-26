import Link from "next/link";

/** The real Wanasis wordmark (assets/brand). PNG master until the client's vector arrives (OQ-5). */
export function Logo({ variant = "color", className = "" }: { variant?: "color" | "white"; className?: string }) {
  const base = variant === "white" ? "wanasis-logo-white" : "wanasis-logo";
  return (
    <Link href="/" className={`inline-block ${className}`} aria-label="Wanasis — accueil">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/brand/${base}-320.webp`}
        srcSet={`/brand/${base}-320.webp 320w, /brand/${base}-640.webp 640w`}
        sizes="180px"
        width={640}
        height={64}
        alt="Wanasis"
        className="h-auto w-[150px] md:w-[180px]"
      />
    </Link>
  );
}
