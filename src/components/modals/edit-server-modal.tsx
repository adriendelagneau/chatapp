"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

// import { useRouter } from "next/navigation";
import { uploadImage } from "@/actions/image-upload";
import { updateServer } from "@/actions/server-actions";
import { useModal } from "@/hooks/use-modal-store";
import { FormSchema } from "@/lib/schemas";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

export const EditServerModal = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { isOpen, onClose, type, data } = useModal();
  //   const router = useRouter();
  const isModalOpen = isOpen && type === "editServer";
  const { server } = data;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { name: "", imageUrl: "" },
  });

  useEffect(() => {
    if (server) {
      form.setValue("name", server.name);
      form.setValue("imageUrl", server.imageUrl);
    }
  }, [server, form]);

  const isLoading = form.formState.isSubmitting;
  if (!server) return null;

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      await updateServer({
        serverId: server.id,
        name: values.name,
        imageUrl: values.imageUrl,
      });

      onClose();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", imageFile);

    try {
         const response = (await uploadImage(formData)) as { url: string };
      form.setValue("imageUrl", response.url);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="overflow-hidden p-0">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-semibold">
            Update a server
          </DialogTitle>
          <DialogDescription className="text-center">
            Change name and an image. You can always change it later.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              {/* Image Display Logic */}
              <div className="flex flex-col items-center justify-center gap-4 text-center">
                {form.watch("imageUrl") || previewUrl ? (
                  <div className="relative">
                    <div className="relative h-24 w-24 overflow-hidden rounded-full border">
                      <Image
                        src={form.watch("imageUrl") || previewUrl!}
                        alt="Server Preview"
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                    <button
                      type="button"
                      className="absolute top-1 -right-4 z-20 h-8 w-8 cursor-pointer rounded-full p-1"
                      onClick={() => {
                        setPreviewUrl(null);
                        setImageFile(null);
                        form.setValue("imageUrl", "");
                      }}
                    >
                      X
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer text-blue-500 underline">
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                      disabled={isLoading}
                    />
                  </label>
                )}
              </div>

              {/* Upload Button */}
              {previewUrl && !form.watch("imageUrl") && (
                <div className="flex justify-center">
                  <Button
                    type="button"
                    onClick={handleImageUpload}
                    className="cursor-pointer"
                    disabled={uploading}
                  >
                    {uploading ? "Uploading..." : "Upload Image"}
                  </Button>
                </div>
              )}

              {/* Server Name Field */}
              <FormField
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase">
                      Server Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Enter your server name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Footer with Create Button */}
            <DialogFooter className="px-6 py-4">
              <Button
                type="submit"
                variant="secondary"
                className="cursor-pointer"
              >
                update
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
