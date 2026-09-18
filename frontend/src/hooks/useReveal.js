import { useEffect, useRef } from "react";

// Reveal children when they scroll into view.
// Add className="reveal" to any element inside the container.
export function useReveal(threshold = 0.15) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold, rootMargin: "0px 0px -50px 0px" }
    );
    ref.current.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [threshold]);

  return ref;
}
