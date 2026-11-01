import React from 'react';

interface GinkgoIconProps {
  className?: string;
  size?: number;
}

export const GinkgoIcon: React.FC<GinkgoIconProps> = ({ className = 'w-4 h-4', size = 16 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Ginkgo Fan Leaf SVG */}
      <path
        d="M12 21C12 21 12 16 12 13M12 13C8.5 13 3 10.5 3 6C5.5 3.5 9 5 12 7.5C15 5 18.5 3.5 21 6C21 10.5 15.5 13 12 13Z"
        fill="#f59e0b"
        stroke="#d97706"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Leaf ribs subtle texture */}
      <path
        d="M12 13C10.5 10 9 8 7 7"
        stroke="#fbbf24"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M12 13C13.5 10 15 8 17 7"
        stroke="#fbbf24"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M12 13V8"
        stroke="#fbbf24"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
};
