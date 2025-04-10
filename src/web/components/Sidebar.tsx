import React, { useEffect, useRef } from "react";
import { createSwapy, Swapy } from "swapy";
import PriorityArrow from "./ui/PriorityArrow";

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
            <PriorityArrow />
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
