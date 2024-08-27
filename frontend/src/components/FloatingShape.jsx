import { motion } from "framer-motion";

function FloatingShape({ color, size, top, left, delay }) {
  const float = {
    y: ["0%", "100%", "0%"],
    x: ["0%", "100%", "0%"],
    rotate: [0, 360],
    transition: {
      duration: 20,
      ease: "linear",
      repeat: Infinity,
      delay,
    },
  };

  return (
    <motion.div
      animate={float}
      aria-hidden="true"
      className={`absolute  rounded-full ${color} ${size} opacity-20 blur-xl`}
      style={{ top, left }}
    ></motion.div>
  );
}

export default FloatingShape;
