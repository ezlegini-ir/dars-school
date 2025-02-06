"use client";

import React from "react";
import InputField from "../InputField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BackButton from "../BackButton";
import { KeyRound } from "lucide-react";
import axios, { AxiosError } from "axios";
import useError from "@/hooks/useError";
import useSuccess from "@/hooks/useSuccess";
import useLoading from "@/hooks/userLoading";
import Spinner from "../Spinner";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
});

const ResetPasswordForm = () => {
  // HOOKS
  const { error, setError } = useError();
  const { success, setSuccess } = useSuccess();
  const { loading, setLoading } = useLoading();

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
      const res = await axios.post("/api/auth/actions/reset-password", data);
      setSuccess(res.data.success);
      reset();
      setLoading("");
    } catch (error) {
      setLoading("");

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
        <KeyRound size={40} className="text-blue-800" />
        <h3 className="mb-0">Reset Your Password</h3>
        <p className="text-gray-500 text-sm">
          Enter your email to send reset link
        </p>
      </div>

      <InputField
        label="Email"
        name="email"
        register={register}
        error={errors.email}
        type="email"
      />

      <button
        disabled={!isValid || loading === "ACTION"}
        className="btn btn-primary w-full py-3 flex gap-2 justify-center"
      >
        {loading && <Spinner className="h-5 w-5" />}
        {loading ? "Sending" : "Send Reset Link"}
      </button>
      {error && <p className="alert alert-danger">{error}</p>}
      {success && <p className="alert alert-success">{success}</p>}
      <BackButton />
    </form>
  );
};

export default ResetPasswordForm;
