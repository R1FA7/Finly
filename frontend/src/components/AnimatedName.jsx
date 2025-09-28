export const AnimatedName = () => {
  const letters = ["n", "l", "y"];

  return (
    <div className="font-rubik text-3xl font-extrabold flex gap-1 text-indigo-900 dark:text-amber-300">
      <span>F</span>
      <span className="relative [animation:right-to-left_3.5s_ease_infinite]">
        <span
          className="absolute left-1/2 -translate-x-1/2 -top-5
           text-blue-500 dark:text-cyan-400
           drop-shadow-[0_2px_4px_rgba(67,56,202,1)]
           [animation:drop-from-top_3.5s_ease_infinite]"
        >
          .
        </span>
        ı
      </span>
      {letters.map((char, i) => (
        <span key={i} className="[animation:right-to-left_3.5s_ease_infinite]">
          {char}
        </span>
      ))}
    </div>
  );
};
