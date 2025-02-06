import LoginForm from "@/app/components/forms/LoginForm";
import { Metadata } from "next";
import React from "react";

const LoginPage = () => {
  return (
    <div>
      <LoginForm />
    </div>
  );
};

export default LoginPage;

export const metadata: Metadata = {
  title: "Login",
  description: "Login to dars account",
};
