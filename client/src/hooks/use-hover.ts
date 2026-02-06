import { useEffect, useState } from "react";

const useHover = <T extends HTMLElement = HTMLElement>(
  ref: React.RefObject<T | null>,
) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

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
