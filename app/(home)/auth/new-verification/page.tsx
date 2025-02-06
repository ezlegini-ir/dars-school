import React, { Suspense } from "react";
import NewVerificationCard from "./NewVerificationCard";

const page = () => {
  return (
    <Suspense>
      <NewVerificationCard />
    </Suspense>
  );
};

export default page;
