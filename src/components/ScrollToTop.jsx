import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  // useLocation nos da información sobre la ruta actual
  const { pathname } = useLocation();

  useEffect(() => {
    // Cada vez que cambie el "pathname" (la ruta), subimos arriba
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // Este componente no renderiza nada visualmente
};

export default ScrollToTop;