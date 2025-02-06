"use client";

import useError from "@/hooks/useError";
import useLoading from "@/hooks/userLoading";
import {
  UpdateUserFormType,
  UserFormType,
  updateUserFormSchema,
  userFormSchema,
} from "@/lib/ValidationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image, userRole } from "@prisma/client";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import nProgress from "nprogress";
import "nprogress/nprogress.css";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import Spinner from "../Spinner";

type User = {
  image: Image | null;
} & {
  name: string;
  role: userRole;
  id: number;
  email: string;
  emailVerified: Date | null;
};

interface Props {
  type: "CREATE" | "UPDATE";
  data?: User;
  setOpen?: (value: boolean) => void;
  setSuccess?: (value: string) => void;
}

const UserForm = ({ type, data, setOpen, setSuccess }: Props) => {
  // HOOKS
  const router = useRouter();
  const { error, setError } = useError();
  const { loading, setLoading } = useLoading();

  // USER
  const id = data?.id;

  // REACT-HOOK-FORM
  const schema = type === "CREATE" ? userFormSchema : updateUserFormSchema;
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<UserFormType & UpdateUserFormType>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const onSubmit = async (data: UserFormType) => {
    nProgress.start();
    setLoading("ACTION");
    setError("");
    setSuccess?.("");

    try {
      const formData = new FormData();
      // APPEND STRING TO FORM
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("role", data.role);
      // APPEND IMAGE TO FORM
      if (data.image) {
        formData.append("image", data.image);
      }

      // REQUEST
      const res =
        type === "CREATE"
          ? await axios.post("/api/users", formData)
          : await axios.patch(`/api/users/${id}`, formData);

      nProgress.done();
      setLoading("");
      setSuccess?.(res.data.success);

      router.refresh();
      setOpen?.(false);
    } catch (error) {
      nProgress.done();
      setLoading("");

      if (error instanceof AxiosError) {
        setError(error.response?.data.error);
      } else {
        setError("" + error);
      }
    }
  };

  const onDelete = async (id: number) => {
    setLoading("DELETE");
    nProgress.start();
    setSuccess?.("");
    setError("");

    try {
      const res = await axios.delete(`/api/users/${id}`);
      router.refresh();
      nProgress.done();
      setLoading("");

      setSuccess?.(res.data.success);
      setOpen?.(false);
    } catch (error) {
      nProgress.done();
      setLoading("");
      if (error instanceof AxiosError) {
        setError(error.response?.data.error);
      } else {
        setError("" + error);
      }
    }
  };

  return (
    <>
      <h3 className="text-center mb-5">
        {type === "CREATE" ? "Create a new user" : "Update User"}
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="form space-y-3">
        <InputField
          label=""
          name="image"
          image={data?.image}
          register={register}
          error={errors.image}
          type="file"
          imageType="USER"
          setValue={setValue}
        />

        <InputField
          label="Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors.name}
          type="text"
        />

        <InputField
          label="Email"
          name="email"
          defaultValue={data?.email}
          register={register}
          error={errors.email}
          type="email"
          inputProps={{
            disabled: type === "UPDATE",
          }}
        />

        <InputField
          label="Password"
          name="password"
          register={register}
          error={errors.password}
          type="password"
        />

        <div>
          <label className="form-label" htmlFor="role">
            Role
          </label>
          <select
            {...register("role")}
            className="form-control"
            name="role"
            id="role"
            defaultValue={data?.role}
          >
            <option value={"AUTHOR"}>✍️ Author</option>
            <option value={"ADMIN"}>🧑‍💼 Admin</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-xs">{errors.role.message}</p>
          )}
        </div>

        <button
          disabled={!isValid || loading !== ""}
          className="btn btn-primary w-full py-3 flex justify-center items-center gap-2 relative"
          type="submit"
        >
          {loading === "ACTION" && <Spinner className="w-5 h-5" />}
          {type === "CREATE"
            ? loading === "ACTION"
              ? "Creating"
              : "Create"
            : loading === "ACTION"
            ? "Uptading"
            : "Update"}
        </button>
        {type === "UPDATE" && (
          <div>
            <button
              disabled={loading !== ""}
              onClick={() => onDelete(id!)}
              className="btn btn-danger w-full py-3 flex items-center justify-center gap-2"
              type="button"
            >
              {loading === "DELETE" && <Spinner className="w-5 h-5" />}
              {loading === "DELETE" ? "Deleting" : "Delete"}
            </button>
          </div>
        )}
        {error && <p className="alert alert-danger">{error}</p>}
      </form>
    </>
  );
};

export default UserForm;
