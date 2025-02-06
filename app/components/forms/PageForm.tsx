"use client";

import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { pageFormSchema, PageFormType } from "@/lib/ValidationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pages } from "@prisma/client";
import TextEditor from "../TextEditor";
import useEditorContent from "@/hooks/useEditorContent";
import Spinner from "../Spinner";
import useLoading from "@/hooks/userLoading";
import useError from "@/hooks/useError";
import useSuccess from "@/hooks/useSuccess";
import axios, { AxiosError } from "axios";
import nProgress from "nprogress";
import { useRouter } from "next/navigation";

interface Props {
  type: "CREATE" | "UPDATE";
  page?: Pages | null;
}

const PageForm = ({ page, type }: Props) => {
  // HOOKS
  const { editorContent, setEditorContent } = useEditorContent(page?.content);
  const { loading, setLoading } = useLoading();
  const { error, setError } = useError();
  const { success, setSuccess } = useSuccess();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<PageFormType>({
    resolver: zodResolver(pageFormSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: PageFormType) => {
    nProgress.start();
    setSuccess("");
    setError("");
    setLoading("ACTION");

    try {
      const res =
        type === "CREATE"
          ? await axios.post("/api/pages", data)
          : await axios.patch(`/api/pages/${page?.id}`, data);
      console.log(res.data);
      if (type === "CREATE") {
        router.push(`/panel/pages/edit/${res.data.data.id}`);
      } else {
        setSuccess(res.data.success);
        router.refresh();
      }
      nProgress.done();
      setLoading("");
    } catch (error) {
      setSuccess("");
      setLoading("");
      nProgress.done();
      if (error instanceof AxiosError) {
        setError(error.response?.data.error);
      } else {
        setError("" + error);
      }
    }
  };

  const onDelete = async () => {
    setLoading("DELETE");
    setError("");
    nProgress.start();

    try {
      await axios.delete(`/api/pages/${page?.id}`);
      nProgress.done();
      router.push("/panel/pages");
      router.refresh();
    } catch (error) {
      nProgress.done();
      setLoading("");

      if (error instanceof AxiosError) {
        setError(error.response?.data.error);
      }
      setError("" + error);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-3 flex gap-5 flex-wrap md:flex-nowrap"
      >
        <div className="w-full md:w-9/12 space-y-3">
          <InputField
            type="text"
            label="Title"
            name="title"
            register={register}
            defaultValue={page?.title}
            error={errors.title}
          />

          <InputField
            type="text"
            label="Description"
            name="description"
            register={register}
            defaultValue={page?.description}
            error={errors.description}
          />

          <InputField
            type="text"
            label="URL"
            name="url"
            register={register}
            defaultValue={page?.url}
            error={errors.url}
          />

          <TextEditor
            register={register}
            editorContent={editorContent}
            setEditorContent={setEditorContent}
          />
        </div>
        <div className="w-full md:w-3/12 space-y-3">
          <div>
            <p className="form-label">Action</p>
            <button
              disabled={!isValid || loading !== ""}
              type="submit"
              className="btn btn-primary p-2.5 w-full flex justify-center items-center gap-2 mb-3"
            >
              {loading === "ACTION" && <Spinner className="w-5 h-5" />}
              {type === "CREATE"
                ? loading === "ACTION"
                  ? "Creating"
                  : "Create"
                : loading === "ACTION"
                ? "Updating"
                : "Update"}
            </button>
            {error && <p className="alert alert-danger">{error}</p>}
            {success && <p className="alert alert-success">{success}</p>}
          </div>
          {type === "UPDATE" && (
            <div>
              <button
                disabled={loading !== ""}
                onClick={onDelete}
                type="button"
                className="btn btn-danger p-2.5 w-full flex justify-center items-center gap-2"
              >
                {loading === "DELETE" && <Spinner className="w-5 h-5" />}
                {loading === "DELETE" ? "Deleting" : "Delete"}
              </button>
            </div>
          )}
        </div>
      </form>
    </>
  );
};

export default PageForm;
