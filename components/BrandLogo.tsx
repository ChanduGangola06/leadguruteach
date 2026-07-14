import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = {
  href?: string;
  /** Icon-only square size in px */
  size?: number;
  /** Show the logo mark only (no wordmark image crop) */
  showText?: boolean;
  className?: string;
  priority?: boolean;
};

/**
 * Official LeadGuru Teach brand mark.
 * Uses /public/logo.png everywhere the old graduation-cap / text logo appeared.
 */
export default function BrandLogo({
  href = "/",
  size = 40,
  showText = true,
  className = "",
  priority = false,
}: BrandLogoProps) {
  const content = (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Image
        src="/logo.png"
        alt="LeadGuru Teach"
        width={size}
        height={size}
        priority={priority}
        className="shrink-0 object-contain"
      />
      {showText && (
        <span className="font-heading text-lg font-bold leading-tight text-[#002D5B] md:text-xl">
          Lead<span className="text-[#F58220]">Guru</span> Teach
        </span>
      )}
    </span>
  );

  if (!href) return content;

  return (
    <Link href={href} className="inline-flex items-center" aria-label="LeadGuru Teach Home">
      {content}
    </Link>
  );
}
