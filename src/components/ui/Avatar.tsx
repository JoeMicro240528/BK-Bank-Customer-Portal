"use client";

/* eslint-disable @next/next/no-img-element */
import { UserCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Profile picture with a fallback icon.
 *
 * SudaPass returns a presigned S3 URL that expires about an hour after login,
 * while the session lasts days -- so the image often fails to load even though
 * `src` is present. Falling back on the error event (not just on a missing
 * `src`) keeps a broken-image box from showing.
 */
export default function Avatar({
  src,
  alt,
  size = 40,
  className,
  fallbackClassName,
}: {
  src?: string;
  alt: string;
  size?: number;
  className?: string;
  fallbackClassName?: string;
}) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Retry when a fresh URL arrives (e.g. after a session refresh).
    setFailed(false);

    // The image is server-rendered, so a load failure can happen before React
    // hydrates and attaches onError -- that event is then missed entirely.
    // A finished-but-zero-width image is one that already failed.
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth === 0) {
      setFailed(true);
    }
  }, [src]);

  if (!src || failed) {
    return (
      <span className={fallbackClassName} aria-hidden="true">
        <UserCircle size={Math.round(size * 0.65)} />
      </span>
    );
  }

  return (
    <img
      ref={imgRef}
      className={className}
      src={src}
      alt={alt}
      width={size}
      height={size}
      onError={() => setFailed(true)}
    />
  );
}
