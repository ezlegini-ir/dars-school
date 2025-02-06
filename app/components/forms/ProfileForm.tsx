"use client";

import React, { useState } from "react";
import InputField from "../InputField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateProfileFormSchema,
  UpdateProfileFormType,
} from "@/lib/ValidationSchema";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import nProgress from "nprogress";
import useError from "@/hooks/useError";
import useSuccess from "@/hooks/useSuccess";
import useLoading from "@/hooks/userLoading";
import Spinner from "../Spinner";
import { ChevronDownIcon } from "lucide-react";

interface Props {
  user:
    | ({
        image: {
          url: string;
          public_id: string;
        } | null;
      } & {
        id: number;
        name: string;
        email: string;
      })
    | null;
}

const ProfileForm = ({ user }: Props) => {
  // HOOKS
  const router = useRouter();
  const { error, setError } = useError();
  const { success, setSuccess } = useSuccess();
  const { loading, setLoading } = useLoading();
  const [isOpenPassword, setIsOpenPassword] = useState(false);

  // REACT HOOK FORM
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<UpdateProfileFormType>({
    resolver: zodResolver(updateProfileFormSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: UpdateProfileFormType) => {
    nProgress.start();
    setLoading("ACTION");
    setError("");
    setSuccess?.("");

    try {
      const formData = new FormData();
      // APPEND STRING TO FORM
      formData.append("name", data.name);
      if (data.oldPassword && data.newPassword) {
        formData.append("oldPassword", data.oldPassword);
        formData.append("newPassword", data.newPassword);
      }
      // APPEND IMAGE TO FORM
      if (data.image) {
        formData.append("image", data.image);
      }

      const res = await axios.patch(`/api/users/me/${user?.id}`, formData);

      setSuccess?.(res.data.success);
      nProgress.done();
      setLoading("");
      router.refresh();
    } catch (error) {
      nProgress.done();
      setLoading("");

      console.log(error);
      if (error instanceof AxiosError) {
        setError(error.response?.data.error);
      } else {
        setError("" + error);
      }
    }
  };

  return (
    <>
      <h3 className="text-center mb-5">Update Your Profile</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="form space-y-3">
        <InputField
          label=""
          name="image"
          defaultValue={user?.name}
          type="file"
          image={user?.image}
          imageType="USER"
          register={register}
          error={errors.image}
          setValue={setValue}
        />

        <InputField
          label="Name"
          name="name"
          defaultValue={user?.name}
          type="text"
          register={register}
          error={errors.name}
        />

        <button
          type="button"
          className="btn bg-slate-100 hover:bg-slate-200 w-full flex justify-center items-center gap-2 text-sm text-gray-500 hover:text-black"
          onClick={() => setIsOpenPassword(!isOpenPassword)}
        >
          <ChevronDownIcon
            size={20}
            className={`transition-transform duration-300 ${
              isOpenPassword ? "rotate-180" : "rotate-0"
            }`}
          />
          Reset Password
        </button>
        <div
          className={`transition-all duration-700 overflow-hidden ${
            isOpenPassword ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {isOpenPassword && (
            <>
              <InputField
                label="Old Password"
                name="oldPassword"
                type="password"
                register={register}
                error={errors.oldPassword}
              />

              <InputField
                label="New Password"
                name="newPassword"
                type="password"
                register={register}
                error={errors.newPassword}
              />
            </>
          )}
        </div>

        <button
          disabled={!isValid || loading === "ACTION"}
          className="btn btn-primary w-full py-3 flex justify-center items-center gap-2 relative"
          type="submit"
        >
          {loading === "ACTION" && <Spinner className="w-5 h-5" />}
          {loading === "ACTION" ? "Saving" : "Save"}
        </button>
        {error && <p className="alert alert-danger">{error}</p>}
        {success && <p className="alert alert-success">{success}</p>}
      </form>
    </>
  );
};

export default ProfileForm;
