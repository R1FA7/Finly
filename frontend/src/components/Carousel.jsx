import { useEffect, useState } from "react";
import { BarBreakdownChart } from "./charts/BarBreakDownChart";
import { HorizontalBarBreakdown } from "./charts/HorizontalBreakDownBar";
import { LineBreakDownChart } from "./charts/LineBreakDownChart";
import { SetGoalCard } from "./SetGoalCard";

export const Carousel = ({ carouselData }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  // if autoplay slide next in 2.5s
  useEffect(() => {
    if (!autoPlay) return;

    const timer = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % carouselData.length);
    }, 2500);

    return () => clearTimeout(timer);
  }, [activeIndex, autoPlay, carouselData.length]);

  // Fix offset calculation
  const getItemStyle = (index) => {
    let offset = index - activeIndex;

    // Wrap offset to range [-length/2, length/2]
    const half = Math.floor(carouselData.length / 2);
    while (offset > half) offset -= carouselData.length;
    while (offset < -half) offset += carouselData.length;

    const x = offset * 400; //H. dist b/w cards
    const z = -Math.abs(offset) * 400; // depth for 3d
    const opacity = Math.max(0, 1 - Math.abs(offset) * 0.6);
    const scale = 1 - Math.abs(offset) * 0.1;

    return {
      transform: `translateX(${x}px) translateZ(${z}px) scale(${scale})`,
      opacity,
      transition: "all 0.9s cubic-bezier(0.4, 0, 0.2, 1)",
      position: "absolute", //container relative
      top: 0,
      left: "50%",
      marginLeft: "-160px", // half width (w-80 = 320px, so 320/2 = 160px)
      willChange: "transform, opacity",
    };
  };

  return (
    <div
      className="relative w-full h-72"
      style={{ perspective: "1000px", overflow: "visible" }}
      onMouseEnter={() => setAutoPlay(false)}
      onMouseLeave={() => setAutoPlay(true)}
    >
      {carouselData.map((carousel, index) => (
        <div
          key={index}
          className="w-80 h-72 bg-gradient-to-br from-slate-750/80 to-slate-900/80 backdrop-blur-sm border border-indigo-500 rounded-2xl pt-2 px-5 shadow-2xl"
          style={getItemStyle(index)}
        >
          <h3 className="text-sm font-semibold text-slate-300 mb-3">
            {carousel.heading}
          </h3>
          {carousel.graphType === "LineChart" ? (
            <LineBreakDownChart data={carousel.data} />
          ) : carousel.graphType === "HorizontalBarChart" ? (
            <HorizontalBarBreakdown data={carousel.data} />
          ) : carousel.graphType === "BarChart" ? (
            <BarBreakdownChart
              data={carousel.data}
              type={carousel.type}
              frequency={carousel.frequency}
              showBoth={carousel.showBoth}
            />
          ) : (
            <SetGoalCard
              data={carousel.data}
              type={carousel.data.type}
              onSubmitGoal={() => console.log("Goal Submitted.")}
              readOnly={true}
            />
          )}
        </div>
      ))}
    </div>
  );
};
