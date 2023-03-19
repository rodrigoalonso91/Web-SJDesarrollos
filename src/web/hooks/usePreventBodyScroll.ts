import { useEffect } from "react";

export default function usePreventBodyScroll() {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "scroll";
    };
  }, []);
}