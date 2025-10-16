import { useEffect, useRef, useState } from "react";

export default function AnimatedStats() {
  const [stats, setStats] = useState([
    { number: 0, label: "Active Users", target: 50, suffix: "K+" },
    { number: 0, label: "Tracked Monthly", target: 2, suffix: "M+" },
    { number: 0, label: "Satisfaction Rate", target: 98, suffix: "%" },
  ]);

  const sectionRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // When section comes into view and hasn't animated yet
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            animateCounters();
          }
        });
      },
      { threshold: 0.5 } // Trigger when 50% of section is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const animateCounters = () => {
    const duration = 1000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setStats((prevStats) =>
        prevStats.map((stat) => ({
          ...stat,
          number: Math.floor(stat.target * progress),
        }))
      );

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  };

  return (
    <section
      ref={sectionRef}
      className="relative px-6 lg:px-12 py-20 max-w-7xl mx-auto"
    >
      <div className="text-center mb-16">
        <h2 className="text-4xl lg:text-5xl font-bold mb-4">Our Impact</h2>
        <p className="text-xl text-slate-400">Trusted by thousands.</p>
      </div>

      <div className="flex justify-evenly gap-8 text-center">
        {stats.map((stat, i) => (
          <div key={i} className="group">
            <div className="relative inline-block">
              <div className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4 transition-transform group-hover:scale-110">
                {stat.number}
                <span className="text-3xl">{stat.suffix}</span>
              </div>
              {/* Animated underline */}
              <div className="h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </div>
            <p className="text-slate-400 text-lg mt-4">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
