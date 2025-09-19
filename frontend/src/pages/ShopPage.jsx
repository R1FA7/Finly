import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { resData } from "../assets/assets";
import { Button } from "../components/Button";
import RestaurantCard from "../components/RestaurantCard";

export const ShopPage = () => {
  const navigate = useNavigate();
  const [rests, setRests] = useState([]);
  const [filteredRests, setFilteredRests] = useState([]);
  const [searchRest, setSearchRest] = useState("");

  useEffect(() => {
    setRests(resData);
    setFilteredRests(resData);
    console.log(resData);
    // navigate("/test");
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchRest, rests]);

  const handleFilter = () => {
    const tmp = rests.filter((rest) => parseFloat(rest.avgRating) >= 4.5);
    setFilteredRests(tmp);
  };

  const handleSearch = () => {
    const query = searchRest.trim().toLocaleLowerCase();
    const filtered = rests.filter((rest) =>
      rest.name.toLowerCase().includes(query)
    );
    setFilteredRests(filtered);
  };
  return (
    <div>
      <Slider />
      <div className="border border-blue-900 m-1">
        <div className="">
          <div className="p-2 flex gap-3">
            <input
              type="text"
              className="p-2 w-3/4 border border-amber-500 rounded-2xl"
              placeholder="search something"
              value={searchRest}
              onChange={(e) => setSearchRest(e.target.value)}
            />
            <Button text={"search"} onClick={() => handleSearch()} />
          </div>
          <div className="ml-2 cursor-pointer">
            <Button
              text={"Top Rated Restaurants"}
              onClick={(e) => handleFilter(e)}
            />
          </div>
          <div className="border border-gray-600 my-2"></div>
          <div className="p-4">
            <div className="flex flex-wrap gap-6">
              {filteredRests.length === 2 ? (
                <p className="text-red-500">No restaurants found.</p>
              ) : (
                filteredRests.map((rest) => (
                  <RestaurantCard key={rest.name} data={rest} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CARD_WIDTH = 280;
const GAP = 20;
const TOTAL_WIDTH = CARD_WIDTH + GAP;

const Slider = () => {
  const [rests, setRests] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);
  const isResetting = useRef(false);

  useEffect(() => {
    setRests(resData); // Your original data
  }, []);

  const fullList = [...rests, ...rests.slice(0, 3)]; // Clone first few cards

  useEffect(() => {
    if (rests.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, [rests]);

  // Reset logic to simulate infinite loop
  useEffect(() => {
    if (currentIndex === rests.length) {
      isResetting.current = true;

      // Wait for transition to finish, then reset position without animation
      setTimeout(() => {
        if (sliderRef.current) {
          sliderRef.current.style.transition = "none";
          sliderRef.current.style.transform = `translateX(0px)`;
        }
        setCurrentIndex(0);

        // Force re-enable transition after reset (next tick)
        setTimeout(() => {
          if (sliderRef.current) {
            sliderRef.current.style.transition = "transform 0.7s ease";
          }
          isResetting.current = false;
        }, 50);
      }, 700); // match transition duration
    }
  }, [currentIndex, rests.length]);

  const translateX = -currentIndex * TOTAL_WIDTH;

  return (
    <div
      style={{
        width: "40rem",
        overflow: "hidden",
        margin: "0 auto",
      }}
    >
      <div
        ref={sliderRef}
        style={{
          display: "flex",
          gap: `${GAP}px`,
          transform: `translateX(${translateX}px)`,
          transition: isResetting.current ? "none" : "transform 0.7s ease",
        }}
      >
        {fullList.map((rest, i) => (
          <div
            key={i}
            style={{
              flexShrink: 0,
              width: `${CARD_WIDTH}px`,
              transform:
                i === currentIndex
                  ? "scale(1)"
                  : i === currentIndex + 1 || i === currentIndex - 1
                  ? "scale(0.9)"
                  : "scale(0.85)",
              opacity: i === currentIndex ? 1 : 0.5,
              transition: "all 0.7s ease",
            }}
          >
            <RestaurantCard data={rest} />
          </div>
        ))}
      </div>
    </div>
  );
};
