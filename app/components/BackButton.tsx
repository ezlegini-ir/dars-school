"use client";

import { useRouter } from "next/navigation";
import React from "react";

const BackButton = () => {
  const router = useRouter();

  return (
    <button
      className="btn btn-secondary w-full py-3"
      type="button"
      onClick={() => router.back()}
    >
      Back
    </button>
  );
};

export default BackButton;
