
export const pageTransitions = {
  initial: "animate-in fade-in duration-300",  // Page entry animation
  exit: "animate-out fade-out duration-200",   // Page exit animation
  slideIn: "animate-in slide-in-from-right duration-300",  // Slide in from right
  slideOut: "animate-out slide-out-to-left duration-200",  // Slide out to left
  scaleIn: "animate-in zoom-in duration-300",  // Scale in animation
  scaleOut: "animate-out zoom-out duration-200", // Scale out animation
};

export const cardTransitions = {
  hover: "transition-all duration-200 hover:shadow-lg hover:-translate-y-1",
  active: "transition-all duration-100 active:translate-y-0",
};

export const buttonTransitions = {
  base: "transition-all duration-200",
  hover: "hover:shadow-md hover:-translate-y-0.5",
  active: "active:translate-y-0",
};
