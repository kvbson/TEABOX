import React from "react";
import '../../css/ui/priorityArrow.css';

interface PriorityArrowProps {
  color?: string; 
  className?: string;
  width?: number;
  height?: number;
}

const PriorityArrow: React.FC<PriorityArrowProps> = ({
  color = "currentColor",
  className = "priority-arrow-svg",
  width = 38,
  height = 338,
}) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 38 447"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ color }}
    >
      <path
        d="M17.2322 445.768C18.2085 446.744 19.7915 446.744 20.7678 445.768L36.6777 429.858C37.654 428.882 37.654 427.299 36.6777 426.322C35.7014 425.346 34.1184 425.346 33.1421 426.322L19 440.464L4.85786 426.322C3.88155 425.346 2.29864 425.346 1.32233 426.322C0.34602 427.299 0.34602 428.882 1.32233 429.858L17.2322 445.768ZM16.5 0L16.5 444H21.5L21.5 0L16.5 0Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default PriorityArrow;