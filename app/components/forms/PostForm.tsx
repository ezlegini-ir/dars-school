"use client";

import useEditorContent from "@/hooks/useEditorContent";
import useError from "@/hooks/useError";
import useLoading from "@/hooks/userLoading";
import useSuccess from "@/hooks/useSuccess";
import { postFormSchema, PostFormType } from "@/lib/ValidationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category, Image, Post, User } from "@prisma/client";
import axios, { AxiosError } from "axios";
import { Check } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import nProgress from "nprogress";
import "nprogress/nprogress.css";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import Spinner from "../Spinner";
import TextEditor from "../TextEditor";
import Toast from "../Toast";

interface Props {
  type: "CREATE" | "UPDATE";
  post?:
    | ({
        categories: Category[];
        image: Image | null;
      } & Post)
    | null;

  categories: Category[];
  authors: User[];
  id?: number;
}

const PostForm = ({ type, post, categories, authors, id }: Props) => {
  // HOOKS
  const router = useRouter();
  const { error, setError } = useError();
  const { editorContent, setEditorContent } = useEditorContent(post?.content);
  const { success, setSuccess } = useSuccess();
  const { loading, setLoading } = useLoading();

  // SESSION
  const session = useSession();
  const sessionId = session.data?.user.id;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<PostFormType>({
    resolver: zodResolver(postFormSchema),
    mode: "onBlur",
    defaultValues: {
      categories: post?.categories.map((category) => category.id.toString()),
      author: post?.authorId.toString() || sessionId,
    },
  });

  const onSubmit = async (data: PostFormType) => {
    nProgress.start();
    setLoading("ACTION");
    setError("");
    setSuccess("");

    const { title, categories, content, status, url, author, image } = data;

    try {
      const formData = new FormData();
      // APPEND STRING TO FORM
      formData.append("title", title);
      formData.append("url", url);
      formData.append("content", content);
      formData.append("status", status);
      formData.append("author", author);
      formData.append("categories", JSON.stringify(categories));

      // APPEND IMAGE TO FORM
      if (image) {
        formData.append("image", image);
      }

      // REQUEST
      if (type === "CREATE") {
        const res = await axios.post("/api/posts", formData);
        router.push(`/panel/posts/edit/${res.data.data.id}`);
        router.refresh();
      } else {
        const res = await axios.patch(`/api/posts/${id}`, formData);
        setSuccess(res.data.success);
        router.refresh();
      }
      nProgress.done();
      setLoading("");
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
    setError("");
    nProgress.start();
    setLoading("DELETE");

    try {
      await axios.delete(`/api/posts/${id}`);
      nProgress.done();
      router.push(`/panel/posts`);
      router.refresh();
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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex gap-5 flex-wrap md:flex-nowrap"
      >
        <div className="w-full md:w-9/12 space-y-3">
          <InputField
            type="text"
            label="Title"
            name="title"
            register={register}
            defaultValue={post?.title}
            error={errors.title}
          />

          <div>
            <InputField
              type="text"
              label="URL"
              name="url"
              register={register}
              defaultValue={post?.url}
              error={errors.url}
            />
            {post && (
              <>
                <p className="flex gap-2 text-gray-500 text-sm hover:text-blue-800">
                  <Link href={`/blog/${post?.url}`}>
                    {process.env.NEXT_PUBLIC_WEBSITE_URL}/{post?.url}
                  </Link>
                </p>
              </>
            )}
          </div>

          <div>
            <p className="form-label">Content</p>
            <TextEditor
              editorContent={editorContent}
              register={register}
              setEditorContent={setEditorContent}
            />
            <p className="text-red-500 text-xs">{errors.content?.message}</p>
          </div>
        </div>

        <div className="w-full md:w-3/12 space-y-3">
          <div>
            <p className="form-label">Action</p>
            <button
              disabled={!isValid || loading !== ""}
              type="submit"
              className="btn btn-primary p-2.5 w-full flex justify-center items-center gap-2"
            >
              {loading === "ACTION" && <Spinner className="w-5 h-5" />}
              {type === "CREATE"
                ? loading === "ACTION"
                  ? "Saving"
                  : "Create"
                : loading === "ACTION"
                ? "Updating"
                : "Update"}
            </button>
          </div>
          {error && <p className="alert alert-danger">{error}</p>}

          {type === "UPDATE" && (
            <div>
              <button
                disabled={loading === "DELETE"}
                onClick={() => onDelete(id!)}
                type="button"
                className="btn btn-danger p-2.5 w-full flex justify-center items-center gap-2"
              >
                {loading === "DELETE" && <Spinner className="w-5 h-5" />}
                {loading === "DELETE" ? "Deleting" : "Delete"}
              </button>
            </div>
          )}

          <div>
            <label className="form-label" htmlFor="status">
              Status
            </label>
            <select
              {...register("status")}
              className="form-control"
              name="status"
              id="status"
              defaultValue={post?.published ? 1 : 0}
            >
              <option value={0}>❌ Draft</option>
              <option value={1}>✅ Published</option>
            </select>
            {errors.status && <p>{errors.status.message}</p>}
          </div>

          <div>
            <p className="form-label">Image</p>
            <InputField
              label=""
              name="image"
              image={post?.image}
              register={register}
              error={errors.image}
              type="file"
              imageType="POST"
              setValue={setValue}
            />
          </div>

          <div>
            <p className="form-label">Categories</p>
            <div className="form-control max-h-48 overflow-y-scroll">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center space-x-2 p-2 rounded-md border-b hover:bg-gray-100 transition cursor-pointer"
                >
                  <input
                    type="checkbox"
                    {...register("categories")}
                    value={category.id}
                    className="hidden peer"
                  />
                  <div className="w-5 h-5 flex items-center justify-center border border-gray-400 rounded-md peer-checked:bg-blue-500 peer-checked:border-blue-500">
                    <span className="text-slate-50 text-xs">
                      <Check size={15} />
                    </span>
                  </div>
                  <span className="text-gray-700">{category.name}</span>
                </label>
              ))}
            </div>
            {errors.categories && (
              <p className="text-red-500 text-xs">
                {errors.categories.message}
              </p>
            )}
          </div>

          <div>
            <p className="form-label">Author</p>
            <div className="form-control max-h-48 overflow-y-scroll">
              {authors.map((author) => (
                <label
                  key={author.id}
                  className="flex items-center space-x-2 p-2 rounded-md border-b hover:bg-gray-100 transition cursor-pointer"
                >
                  <input
                    type="radio"
                    {...register("author")}
                    value={author.id}
                    className="hidden peer"
                  />
                  <div className="w-5 h-5 flex justify-center items-center border border-gray-400 rounded-full peer-checked:bg-blue-500 peer-checked:border-blue-500">
                    <div className="text-slate-50">
                      <div className="bg-slate-50 rounded-full text-xs h-2 w-2" />
                    </div>
                  </div>
                  <span className="text-gray-700">{author.name}</span>
                </label>
              ))}
            </div>
            <p className="text-red-500 text-xs">{errors.author?.message}</p>
          </div>
        </div>
      </form>
      {success && <Toast message={success} type="SUCCESS" />}
    </>
  );
};

export default PostForm;
