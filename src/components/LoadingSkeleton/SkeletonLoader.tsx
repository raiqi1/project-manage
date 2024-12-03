"use client";

import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

type SkeletonLoaderProps = {
  rows?: number; // Jumlah baris
  height?: number; // Tinggi setiap baris
  width?: any; // Lebar baris
  className?: string; // Kelas tambahan untuk styling
};

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  rows = 5,
  height = 30,
  width = "100%",
  className = "",
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {[...Array(rows)].map((_, index) => (
        <Skeleton
          key={index}
          height={height}
          width={width}
          className={`rounded-md dark:bg-dark-secondary ${className}`}
        />
      ))}
    </div>
  );
};

export default SkeletonLoader;
