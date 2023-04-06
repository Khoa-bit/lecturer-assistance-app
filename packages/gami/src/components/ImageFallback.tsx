import type { ImageProps, StaticImageData } from "next/image";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ImageWithFallbackProps extends ImageProps {
  fallbackSrc: string | StaticImageData;
  alt: string;
}

export default function ImageFallback({
  src,
  fallbackSrc,
  alt,
  ...rest
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <Image
      {...rest}
      src={imgSrc}
      alt={alt}
      onLoadingComplete={(result) => {
        if (result.naturalWidth === 0) {
          // Set fallbackSrc image
          setImgSrc(fallbackSrc);
        }
      }}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
}
