import Image from "next/image";

/**
 * Responsive optimised image for local assets of unknown intrinsic size.
 *
 * Drop-in replacement for `<img className="w-full h-auto block" />`. Uses
 * next/image's documented `width={0} height={0}` + `sizes` pattern so Next
 * serves AVIF/WebP + a resized srcset (a phone gets a phone-sized file, not
 * the full original) while the rendered box stays fluid `width:100%;height:auto`.
 *
 * `priority` disables lazy-loading for above-the-fold images (e.g. the first
 * slide of a carousel); everything else lazy-loads by default.
 */
export default function SmartImage({
  src,
  alt,
  className = "",
  sizes = "(max-width: 768px) 100vw, 768px",
  priority = false,
  draggable,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  draggable?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={0}
      height={0}
      sizes={sizes}
      priority={priority}
      draggable={draggable}
      className={className}
      style={{ width: "100%", height: "auto" }}
    />
  );
}
