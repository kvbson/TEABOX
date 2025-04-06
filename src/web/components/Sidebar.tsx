import React, { useEffect, useRef } from "react";
import { createSwapy, Swapy } from "swapy";

const initialOptions = [
  { id: "1", text: "In Library" },
  { id: "2", text: "Indie" },
  { id: "3", text: "Reviews" },
  { id: "4", text: "Players" },
  { id: "5", text: "Casual" },
  { id: "6", text: "Latest" },
  { id: "7", text: "Genre" },
  { id: "8", text: "Cost" },
];

type SidebarProps = {
  menuOpened: boolean;
};

const Sidebar: React.FC<SidebarProps> = ({menuOpened}) => {
  const swapyRef = useRef<Swapy | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    swapyRef.current = createSwapy(containerRef.current, {
      animation: "dynamic",
      dragAxis: "y",
    });

    swapyRef.current.onSwapEnd(({ slotItemMap }) => {
      const sortedIds = Object.values(slotItemMap.asArray).map(
        ({ item }) => item
      );

      const sortedOptions = sortedIds
        .map((id) => initialOptions.find((option) => option.id === id))
        .filter(Boolean);

      //Could be saved in User's table in Database in the future
      const dbSaveJSON = JSON.stringify(sortedOptions);
      console.log(dbSaveJSON);
    });

    return () => {
      swapyRef.current?.destroy();
    };
  }, []);

  const options = localStorage.getItem("sidebar-items");
  console.log(options);

  return (
    <div className={`sidebar ${!menuOpened ? "hide" : ""}`}>
      <h3>What flavors are the most important?</h3>
      <div className="swapy-container">
        <div className="priority-arrow">
          <span className="top">MOST</span>
          <div className="arrow-line">
            <svg
              className="priority-arrow-svg"
              width="38"
              height="338"
              viewBox="0 0 38 447"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.2322 445.768C18.2085 446.744 19.7915 446.744 20.7678 445.768L36.6777 429.858C37.654 428.882 37.654 427.299 36.6777 426.322C35.7014 425.346 34.1184 425.346 33.1421 426.322L19 440.464L4.85786 426.322C3.88155 425.346 2.29864 425.346 1.32233 426.322C0.34602 427.299 0.34602 428.882 1.32233 429.858L17.2322 445.768ZM16.5 0L16.5 444H21.5L21.5 0L16.5 0Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <span className="bottom">LEAST</span>
        </div>

        <div className="swapy-list" ref={containerRef}>
          {initialOptions.map(({ id }) => {
            const option = initialOptions.find((item) => item.id === id);
            return option ? (
              <div className="swapy-slot" data-swapy-slot={id} key={id}>
                <div className="swapy-item" data-swapy-item={id}>
                  {option.text}
                </div>
              </div>
            ) : null;
          })}
        </div>
      </div>
      <p>
        Drag and drop your preferences to set sorting for the recommendations
      </p>
    </div>
  );
};

export default Sidebar;
