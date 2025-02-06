import { v2 as cloudinary } from "cloudinary";

interface UploadOptions {
  folder?: string;
  width?: number;
  format?: string;
  public_id?: string;
}

// Cloudinary upload function
export const uploadImage = async (buffer: Buffer, options?: UploadOptions) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: options?.folder ? `/uploads/${options?.folder}` : "/uploads",
          format: "webp",
          transformation: options?.width
            ? [{ width: options.width, crop: "limit" }]
            : [{ width: 1200, crop: "limit" }],
          public_id: options?.public_id,
        },
        (error, result) => {
          if (error) reject(error);
          resolve(result);
        }
      )
      .end(buffer);
  });
};

export const deleteImage = async (publicId: string) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) reject(error);
      resolve(result);
    });
  });
};
