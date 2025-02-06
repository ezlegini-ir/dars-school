"use client";

import { noAvatar, placeHolder } from "@/public/images";
import axios from "axios";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import nProgress from "nprogress";
import { InputHTMLAttributes, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FieldError, UseFormSetValue } from "react-hook-form";
import "nprogress/nprogress.css";

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  register: any;
  error?: FieldError;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  setValue?: UseFormSetValue<any>;
  imageType?: "POST" | "USER";
  image?: { url: string; public_id: string } | null;
}

const InputField = ({
  label,
  name,
  type,
  defaultValue,
  register,
  error,
  inputProps,
  setValue,
  imageType,
  image,
}: InputFieldProps) => {
  const router = useRouter();
  const [preview, setPreview] = useState<string | undefined>(undefined);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setPreview(URL.createObjectURL(file));
        setValue?.(name, file); // Update react-hook-form state
      }
    },
    [name, setValue]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: { "image/*": [] },
      multiple: false,
      validator: (file) => {
        const sizeLimit = 2 * 1024 * 1024;
        if (file.size > sizeLimit) {
          return { code: "size-limit", message: "Image must be less than 2mb" };
        }

        return null;
      },
    });

  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <li key={file.path}>
      {errors.map((e) => (
        <span key={e.code}>{e.message}</span>
      ))}
    </li>
  ));

  const handleRemoveImage = () => {
    setPreview(undefined);
  };

  const onDeleteImage = async (public_id: string) => {
    nProgress.start();
    try {
      await axios.delete(`/api/cloudinary/${public_id}`);
      router.refresh();
      nProgress.done();
    } catch (error) {
      console.log(error);
    }
  };

  // CLASSES
  const fileClassName =
    imageType === "USER"
      ? `rounded-full h-28 w-28 ${
          fileRejectionItems[0] ? "border-red-500" : "border-slate-300"
        }`
      : "rounded-lg aspect-video";
  const imgClassName = `w-full h-full object-cover ${
    imageType === "USER" ? " rounded-full" : " rounded-md"
  }`;

  const imageSrc =
    image?.url || (imageType === "USER" ? noAvatar : placeHolder);

  return type === "file" ? (
    <div className="flex flex-col items-center space-y-2">
      <label className="text-sm font-medium">{label}</label>

      <div className="relative">
        <div
          {...getRootProps()}
          className={`photo-frame cursor-pointer flex flex-col items-center gap-3 ${
            isDragActive ? "border-blue-600" : "border-gray-300"
          } ${fileClassName}`}
        >
          <input {...getInputProps()} />
          {preview ? (
            <NextImage
              src={preview}
              alt=""
              width={imageType === "USER" ? 150 : 300}
              height={imageType === "USER" ? 150 : 300}
              className={imgClassName}
            />
          ) : (
            <NextImage
              src={imageSrc}
              alt="User Image"
              width={imageType === "USER" ? 150 : 300}
              height={imageType === "USER" ? 150 : 300}
              className={imgClassName}
            />
          )}
        </div>
        {preview && (
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-1 right-1 aspect-square flex items-center justify-center card rounded-full p-1.5 text-xs hover:bg-red-500 hover:text-white"
          >
            ✕
          </button>
        )}
      </div>
      {image && (
        <button
          onClick={() => onDeleteImage(image?.public_id)}
          type="button"
          className="btn btn-secondary"
        >
          Delete Image
        </button>
      )}

      {error && <p className="text-red-500 text-xs">{error.message}</p>}
      {fileRejectionItems[0] && (
        <ul className="text-red-500 text-xs flex gap-2">
          - {fileRejectionItems}
        </ul>
      )}
    </div>
  ) : (
    <div>
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <input
        {...register(name)}
        {...inputProps}
        type={type}
        name={name}
        id={name}
        defaultValue={defaultValue}
        className={`form-control ${error && "border-red-400"}`}
      />
      {error && <p className="text-red-500 text-xs">{error.message}</p>}
    </div>
  );
};

export default InputField;
