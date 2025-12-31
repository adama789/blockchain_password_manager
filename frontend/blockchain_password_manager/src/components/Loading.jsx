import React from "react";

/**
 * Loading Component
 * * A reusable UI spinner used to indicate background processing.
 */
export default function Loading({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="relative w-10 h-10 mb-2">
        <div className="absolute inset-0 rounded-full border-4 border-gray-600 border-t-accent animate-spin"></div>
      </div>
      <p className="text-white text-sm font-medium">{message}</p>
    </div>
  );
}