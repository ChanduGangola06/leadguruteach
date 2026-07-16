import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = {
  href?: string;
  /** Display height in px (logo is square) */
  size?: number;
  /** Kept for call-site compatibility; full lockup already includes the wordmark */
  showText?: boolean;
  className?: string;
  priority?: boolean;
};

/**
 * Official LeadGuru Teach brand lockup (/public/logo.png).
 */
export default function BrandLogo({
  href = "/",
  size = 40,
  showText = true,
  className = "",
  priority = false,
}: BrandLogoProps) {
  // Full lockup reads better a bit larger when the wordmark is expected
  const height = showText ? Math.max(size, 48) : size;
  const width = height;

  const content = (
    <span className={`inline-flex items-center ${className}`}>
      <Image
        src="/logo.png"
        alt="LeadGuru Teach Private Limited — Learn | Lead | Succeed"
        width={width}
        height={height}
        priority={priority}
        className="shrink-0 rounded-md object-contain"
      />
    </span>
  );

  if (!href) return content;

  return (
    <Link href={href} className="inline-flex items-center" aria-label="LeadGuru Teach Home">
      {content}
    </Link>
  );
}
