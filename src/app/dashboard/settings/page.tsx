/* eslint-disable @next/next/no-img-element */
"use client";
import Header from "@/components/Header";
import { useGetUserLoginQuery, useUpdateUserMutation } from "@/state/api";
import React, { useEffect, useState } from "react";

const Settings = () => {
  const { data: users, refetch } = useGetUserLoginQuery();
  const [updateUser] = useUpdateUserMutation();
  const [edit, setEdit] = useState(false);
  const [username, setUsername] = useState("");
  const [initialName, setInitialName] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  console.log("users",users?.image)

  const handleEdit = () => {
    setEdit(!edit);
  };

  const handleCancel = () => {
    setEdit(false);
    setUsername(initialName);
    setProfileImage(null);
    setPreviewImage(users?.profilePictureUrl || null);
  };

  useEffect(() => {
    if (users) {
      setUsername(users?.username);
      setInitialName(users?.username);
      setPreviewImage(users?.profilePictureUrl || users?.image || null);
    }
  }, [users]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setProfileImage(file);
    if (file) {
      setPreviewImage(URL.createObjectURL(file)); // Optimistic UI
    }
  };

  const handleSave = async () => {
    if (!users) return;
    setLoading(true); // Tampilkan loading

    try {
      const formData = new FormData();
      formData.append("username", username);
      if (profileImage) {
        formData.append("file", profileImage);
      }
      setEdit(false);
      await updateUser({
        userId: users?.userId,
        user: formData,
      }).unwrap();
      refetch(); // Ambil data baru dari API setelah update
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setLoading(false); // Sembunyikan loading
    }
  };

  return (
    <div className="p-8">
      <Header name="Settings" />
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium dark:text-white">
            Username
          </label>
          <input
            type="text"
            value={username}
            disabled={!edit}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm dark:text-white"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label
            htmlFor=""
            className="block text-sm font-medium dark:text-white"
          >
            Email
          </label>
          <input
            type="text"
            value={users?.email}
            disabled
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm dark:text-white"
          />
        </div>
        <div>
        <img src={users?.image} alt="" className="w-10 h-10" />
        </div>
        <div>
          <label className="block text-sm font-medium dark:text-white">
            Profile Image
          </label>
          {edit ? (
            <>
              <input
                type="file"
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm dark:text-white"
                accept="image/*"
                onChange={handleFileChange}
              />
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="mt-2 h-32 w-32 rounded-full object-cover"
                />
              )}
            </>
          ) : (
            <img
              src={previewImage || users?.profilePictureUrl || users?.image }
              alt="Profile"
              className="mt-2 h-32 w-32 rounded-full object-cover"
            />
          )}
        </div>
        <div className="flex gap-3">
          {edit ? (
            <div className="flex gap-3">
              <button className="btn btn-primary" onClick={handleSave}>
                Save
              </button>
              <button className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={handleEdit}>
              Edit
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded bg-white p-6 text-center shadow-md">
            <p className="text-lg font-semibold">Saving changes...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
