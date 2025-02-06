"use client";

import Spinner from "@/app/components/Spinner";
import useError from "@/hooks/useError";
import useSuccess from "@/hooks/useSuccess";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect } from "react";

const NewVerificationCard = () => {
  const { error, setError } = useError();
  const { success, setSuccess } = useSuccess();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = useCallback(async () => {
    if (!token) setError("No Token Provided");

    try {
      const res = await axios.post("/api/auth/actions/new-verification", {
        token,
      });
      console.log(res);
      setError(res.data.error);
      setSuccess(res.data.success);
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(error.response?.data.error);
      }
    }
  }, [token, setError, setSuccess]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <div className="w-full h-full flex items-center">
      <div className="card w-72 mx-auto h-min text-center space-y-5">
        <div>
          <h2 className="mb-1">🔐 Auth</h2>
          <h3 className="text-gray-500 font-normal text-base">
            Confirming Your Email
          </h3>
        </div>
        <div className="flex justify-center">
          {!error && !success && <Spinner className="w-14 h-14" />}
          {error && <p className="alert alert-danger w-full">{error}</p>}
          {success && <p className="alert alert-success w-full">{success}</p>}
        </div>
        <div>
          <Link href={"/auth/login"} className="text-gray-500 hover:text-black">
            Back to Login Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewVerificationCard;
