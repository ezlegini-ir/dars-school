"use client";

import { CategoryFormType, categoryFormSchema } from "@/lib/ValidationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import useError from "@/hooks/useError";

interface Props {
  type: "CREATE" | "UPDATE";
  data?: any;
  setOpen: (value: boolean) => void;
  setSuccess: (value: string) => void;
}

const CategoryForm = ({ type, data, setOpen, setSuccess }: Props) => {
  const id = data?.id;

  const router = useRouter();
  const { error, setError } = useError();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CategoryFormType>({
    resolver: zodResolver(categoryFormSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: CategoryFormType) => {
    setSuccess("");
    setError("");

    try {
      // REQUEST
      const res =
        type === "CREATE"
          ? await axios.post("/api/categories", data)
          : await axios.patch(`/api/categories/${id}`, data);
      reset();
      router.refresh();
      setSuccess(res.data.success);
      setOpen(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(error.response?.data.error);
      } else {
        setError("" + error);
      }
    }
  };

  return (
    <>
      <h3 className="text-center">
        {type === "UPDATE" ? "Update Category" : "Create a new Category"}
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="form space-y-3">
        <InputField
          label="Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors.name}
          type="text"
        />

        <button
          disabled={!isValid}
          className="btn btn-primary w-full py-3"
          type="submit"
        >
          {type === "CREATE" ? "Create" : "Update"}
        </button>
        {error && <p className="alert alert-danger">{error}</p>}
      </form>
    </>
  );
};

export default CategoryForm;
