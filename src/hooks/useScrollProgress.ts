import { useState, useEffect } from "react";

export const useScrollProgress = () => {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      const docHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.body.clientHeight,
        document.documentElement.clientHeight
      );
      const winHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      const total = docHeight - winHeight;
      const percent = total > 0 ? (scrollY / total) * 100 : 0;
      
      setScrollPercent(percent);
      setShowScrollTop(scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return { scrollPercent, showScrollTop };
};
