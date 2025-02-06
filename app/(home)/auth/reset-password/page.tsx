import NewPasswordForm from "@/app/components/forms/NewPasswordForm";
import React, { Suspense } from "react";

const page = () => {
  return (
    <div>
      <Suspense>
        <NewPasswordForm />
      </Suspense>
    </div>
  );
};

export default page;
