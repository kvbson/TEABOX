import React from 'react';
import '../../css/ui/teacupIcon.css';

interface TeacupIconProps {
  color?: string;
  className?: string;
  width?: number;
  height?: number;
}

const TeacupIcon: React.FC<TeacupIconProps> = ({
  color = 'var(--color-primary)',
  className = 'logo',
  width = 64,
  height = 62,
}) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 64 62"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_52_4364)">
        <path
          d="M3.37393 28.0226C3.37393 28.0226 2.28677 41.3191 6.45317 47.0162C10.6196 52.7132 18.0654 57.4514 27.0685 57.4527C36.0716 57.454 42.5396 53.2657 46.8423 47.5878C51.1449 41.9099 50.1989 27.6465 50.1989 27.6465L3.37393 28.0226Z"
          stroke={color}
          strokeWidth="2.36751"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M50.1721 27.6617C50.1721 27.6617 55.6518 27.2926 57.8157 28.6799C60.2403 30.2343 62.4525 33.1064 62.4277 35.9864C62.404 38.7331 60.2843 41.4971 57.9097 42.8778C55.4776 44.2919 49.4863 43.4077 49.4863 43.4077"
          stroke={color}
          strokeWidth="2.36751"
          strokeLinejoin="round"
        />
        <path
          d="M36.3497 27.9863L36.4163 35.7652M36.4163 35.7652L32.1611 35.8318L32.2277 46.8685L40.7379 46.6026L40.4055 35.6988L36.4163 35.7652Z"
          stroke={color}
          strokeWidth="1.29442"
          strokeLinejoin="round"
        />
        <path
          d="M21.803 21.3463C21.803 21.3463 19.278 16.8631 19.7136 14.2507C20.1066 11.8941 23.5416 10.894 24.1537 8.46473C24.7964 5.91378 22.0851 0.848633 22.0851 0.848633M31.5347 21.4403C31.5347 21.4403 29.1903 16.5426 29.7112 13.9458C30.2039 11.4895 33.2733 10.988 33.8854 8.55876C34.5281 6.00781 31.8168 0.942661 31.8168 0.942661"
          stroke={color}
          strokeWidth="1.69683"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M0.647461 57.8281L51.6095 57.9222"
          stroke={color}
          strokeWidth="1.29442"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.8027 60.367L41.9253 60.085"
          stroke={color}
          strokeWidth="1.29442"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_52_4364">
          <rect width="63.611" height="61.014" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default TeacupIcon;