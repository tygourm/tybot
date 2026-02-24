"use client";

import { type RefObject, useEffect, useState } from "react";

const useHover = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    if (!ref.current) return;
    const element = ref.current;

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [ref]);

  return isHovered;
};

export { useHover };
