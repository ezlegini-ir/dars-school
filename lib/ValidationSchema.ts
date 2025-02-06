import { userRole } from "@prisma/client";
import { z } from "zod";

//* USER FORM
export const userFormSchema = z.object({
  name: z.string().min(3, { message: "At least 3 chars" }),
  email: z.string().email(),
  password: z.string().min(8, { message: "At least 8 chars" }),
  image: z.instanceof(File).optional(),
  role: z.nativeEnum(userRole),
});
export type UserFormType = z.infer<typeof userFormSchema>;
//*   UPDATE USER FORM
export const updateUserFormSchema = z.object({
  name: z.string().min(3, { message: "At least 3 chars" }),
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 6, {
      message: "Password must be at least 6 characters long",
    }),
  image: z.instanceof(File).optional(),
  role: z.nativeEnum(userRole),
});
export type UpdateUserFormType = z.infer<typeof updateUserFormSchema>;

//* UPDATE USER PROFILE (ME)
export const updateProfileFormSchema = z.object({
  image: z.instanceof(File).optional(),
  name: z.string().min(3, { message: "At least 3 chars" }),
  oldPassword: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 6, {
      message: "Password must be at least 6 characters long",
    }),
  newPassword: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 6, {
      message: "Password must be at least 6 characters long",
    }),
});
export type UpdateProfileFormType = z.infer<typeof updateProfileFormSchema>;

//* CATEGORY FORM
export const categoryFormSchema = z.object({
  name: z.string().min(2, { message: "At least 2 chars" }),
});
export type CategoryFormType = z.infer<typeof categoryFormSchema>;

//* POST FORM
export const postFormSchema = z.object({
  title: z.string().min(1, { message: "Title is Reqired" }),
  url: z.string().min(3).max(65).trim(),
  content: z.string().min(1, { message: "content is reqiored" }),
  status: z.string(),
  author: z.string(),
  image: z.instanceof(File).optional(),
  categories: z.array(z.string()),
});
export type PostFormType = z.infer<typeof postFormSchema>;

//* LOGIN FORM
export const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
export type LoginFormType = z.infer<typeof loginFormSchema>;

//* PAGE FORM
export const pageFormSchema = z.object({
  title: z.string(),
  description: z.string(),
  url: z.string().min(3),
  content: z.string(),
});
export type PageFormType = z.infer<typeof pageFormSchema>;
