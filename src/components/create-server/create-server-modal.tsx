"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { uploadImage } from "@/actions/image-upload";
import { createServerAction } from "@/actions/server-actions";
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
export const CreateServerModal = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { isOpen, onClose, type } = useModal();

  const isModalOpen = isOpen && type === "createServer";

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      await createServerAction(values);
      form.reset();
      // router.refresh();
      onClose();
    } catch (err) {
      console.error("Failed to create server:", err);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
      setImageFile(file);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", imageFile);

    try {
const response = await uploadImage(formData) as { url: string };
      form.setValue("imageUrl", response.url);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    setPreviewUrl(null);
    setImageFile(null);
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="overflow-hidden p-0">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-semibold">
            Create a server
          </DialogTitle>
          <DialogDescription className="text-center">
            Give your server a personality with a name and an image. You can
            always change it later.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              {/* Image upload */}
              <div className="flex flex-col items-center justify-center gap-4 text-center">
                {previewUrl ? (
                  <div className="relative">
                    <div className="relative h-24 w-24 overflow-hidden rounded-full border">
                      <Image
                        src={previewUrl}
                        alt="Server Preview"
                        fill
                        className="object-cover"
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

              {previewUrl && (
                <div className="flex justify-center">
                  <Button
                    type="button"
                    onClick={handleImageUpload}
                    className="cursor-pointer"
                    disabled={uploading}
                    // variant="primary"
                  >
                    {uploading ? "Uploading..." : "Upload Image"}
                  </Button>
                </div>
              )}

              {/* Server name field */}
              <FormField
                control={form.control}
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

            {/* Footer */}
            <DialogFooter className="px-6 py-4">
              <Button
                type="submit"
                variant="secondary"
                className="cursor-pointer"
                disabled={isLoading}
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
