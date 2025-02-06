"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound } from "lucide-react";
import axios, { AxiosError } from "axios";
import useError from "@/hooks/useError";
import useSuccess from "@/hooks/useSuccess";
import useLoading from "@/hooks/userLoading";
import InputField from "../InputField";
import Spinner from "../Spinner";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";

const schema = z.object({
  password: z.string().min(8),
});

const NewPasswordForm = () => {
  // HOOKS
  const { error, setError } = useError();
  const { success, setSuccess } = useSuccess();
  const { loading, setLoading } = useLoading();
  const router = useRouter();

  // GET TOKEN
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setError("");
    setSuccess("");
    setLoading("ACTION");

    try {
      const res = await axios.post("/api/auth/actions/reset-password/confirm", {
        data,
        token,
      });
      setSuccess(res.data.success);
      reset();
      setLoading("");
    } catch (error) {
      setLoading("");
      reset();

      if (error instanceof AxiosError) {
        setError(error.response?.data.error);
      } else {
        setError("" + error);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="form card space-y-3 mt-12"
    >
      <div className="flex flex-col items-center gap-2">
        <KeyRound size={40} className="text-blue-800 animate-pulse" />
        <h3 className="mb-0">New Password</h3>
        <p className="text-gray-500 text-sm">Enter Your New Password</p>
      </div>

      <InputField
        label="New Passowrd"
        name="password"
        register={register}
        error={errors.password}
        type="password"
        inputProps={{ disabled: !!success }}
      />

      <button
        disabled={!isValid || loading === "ACTION"}
        className="btn btn-primary w-full py-3 flex gap-2 justify-center"
      >
        {loading && <Spinner className="h-5 w-5" />}
        {loading ? "Saving" : "Save New Password"}
      </button>
      {success && <p className="alert alert-success">{success}</p>}
      {error && <p className="alert alert-danger">{error}</p>}
      {success && (
        <button
          className="btn btn-secondary w-full py-3"
          type="button"
          onClick={() => router.push("/auth/login")}
        >
          Back to Login Page
        </button>
      )}
    </form>
  );
};

export default NewPasswordForm;
