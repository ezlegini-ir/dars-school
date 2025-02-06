"use client";

import { loginFormSchema, LoginFormType } from "@/lib/ValidationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import BackButton from "../BackButton";
import InputField from "../InputField";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { DEFAULT_LOGIN_REDIRECT } from "@/data/routes";
import Image from "next/image";
import { DarsLogo } from "@/public/images";
import useError from "@/hooks/useError";
import useSuccess from "@/hooks/useSuccess";
import useLoading from "@/hooks/userLoading";
import Spinner from "../Spinner";

const LoginForm = () => {
  const { error, setError } = useError();
  const { success, setSuccess } = useSuccess();
  const { loading, setLoading } = useLoading();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginFormSchema),
    mode: "onBlur",
  });

  const onLogin = async (data: LoginFormType) => {
    setError("");
    setSuccess("");
    setLoading("ACTION");

    try {
      const res = await axios.post("/api/auth/actions/login", data);

      if (res.data.error) {
        setError(res.data.error);
        setLoading("");
      }

      if (res.data.type === "verify") {
        setSuccess(res.data.success);
        setLoading("");
      } else {
        router.push(DEFAULT_LOGIN_REDIRECT);
        router.refresh();
      }
    } catch (error) {
      setLoading("");
      if (error instanceof AxiosError) {
        setError(error.response?.data.error);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onLogin)}
      className="form card space-y-3 mt-12"
    >
      <div className="flex flex-col items-center gap-5 mt-3">
        <Image src={DarsLogo} width={120} height={120} alt="" />
        <h3 className="text-center mb-0">Log In to Dars Account</h3>
      </div>
      <InputField
        label="Email"
        name="email"
        type="email"
        error={errors.email}
        register={register}
      />
      <div>
        <InputField
          label="Password"
          name="password"
          type="password"
          error={errors.password}
          register={register}
        />

        <Link
          href={"/auth/reset"}
          className="text-xs text-slate-500 hover:text-slate-800"
        >
          Forgot Password?
        </Link>
      </div>

      {error && <p className="alert alert-danger">{error}</p>}
      {success && <p className="alert alert-success">{success}</p>}
      <button
        disabled={!isValid || loading === "ACTION"}
        type="submit"
        className="btn btn-primary w-full py-3 flex justify-center gap-2"
      >
        {loading === "ACTION" && <Spinner className="w-5 h-5" />}
        {loading === "ACTION" ? "Logging In" : "Log In"}
      </button>
      <BackButton />
    </form>
  );
};

export default LoginForm;
