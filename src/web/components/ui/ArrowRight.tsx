import React from "react";
import '../../css/ui/arrowRight.css';

interface ArrowRightProps {
  color?: string;
  className?: string;
  width?: number;
  height?: number;
}

const ArrowRight: React.FC<ArrowRightProps> = ({
  color = "var(--color-primary)",
  className = "",
  width = 42,
  height = 16,
}) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 42 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M41.7071 8.70711C42.0976 8.31658 42.0976 7.68342 41.7071 7.29289L35.3431 0.928932C34.9526 0.538408 34.3195 0.538408 33.9289 0.928932C33.5384 1.31946 33.5384 1.95262 33.9289 2.34315L39.5858 8L33.9289 13.6569C33.5384 14.0474 33.5384 14.6805 33.9289 15.0711C34.3195 15.4616 34.9526 15.4616 35.3431 15.0711L41.7071 8.70711ZM41 7L0 7V9L41 9V7Z"
        fill={color}
      />
    </svg>
  );
};

export default ArrowRight;