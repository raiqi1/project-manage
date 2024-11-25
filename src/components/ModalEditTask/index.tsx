/* eslint-disable @next/next/no-img-element */
import Modal from "@/components/Modal";
import {
  Priority,
  Status,
  useGetProjectsQuery,
  useGetTasksQuery,
  useUpdateTaskMutation,
  useGetTaskDetailsQuery,
} from "@/state/api";
import React, { useEffect, useRef, useState } from "react";
import { format, formatISO } from "date-fns";
import { Task as TaskType } from "@/state/api";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  taskDetails?: TaskType;
};

const ModalEditTask = ({ isOpen, onClose, taskDetails }: Props) => {
  const [updateTask, { isLoading }] = useUpdateTaskMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Status>(Status.ToDo);
  const [priority, setPriority] = useState<Priority>(Priority.Backlog);
  const [tags, setTags] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [authorUserId, setAuthorUserId] = useState("");
  const [assignedUserId, setAssignedUserId] = useState<number | null>(null);
  const [projectId, setProjectId] = useState("");
  const [points, setPoints] = useState("");
  const [defaultFile, setDefaultFile] = useState<string[]>([]);
  const [defaultFileName, setDefaultFileName] = useState<string[]>([]);
  const [file, setFile] = useState<File[] | null>(null);
  const [replaceIndex, setReplaceIndex] = useState<number[]>([]);
  const [deleteIndex, setDeleteIndex] = useState<number[]>([]);
  const [hiddenFiles, setHiddenFile] = useState<number[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  console.log("taskDetails", taskDetails);

  useEffect(() => {
    if (isOpen && taskDetails) {
      // Set values from taskDetails if editing an existing task
      setTitle(taskDetails.title || "");
      setDescription(taskDetails.description || "");
      setStatus(taskDetails.status || Status.ToDo);
      setPriority(taskDetails.priority || Priority.Backlog);
      setTags(taskDetails.tags || "");
      setStartDate(
        taskDetails.startDate
          ? format(new Date(taskDetails.startDate), "yyyy-MM-dd")
          : "",
      );
      setDueDate(
        taskDetails.dueDate
          ? format(new Date(taskDetails.dueDate), "yyyy-MM-dd")
          : "",
      );
      setAssignedUserId(
        taskDetails.assignedUserId !== null &&
          taskDetails.assignedUserId !== undefined
          ? Number(taskDetails.assignedUserId) // Ensure it's a number
          : null, // Or null if not present
      );
      setProjectId(taskDetails.projectId?.toString() || "");
      setDefaultFile(taskDetails.filesUrl || []);
      setDefaultFileName(taskDetails.filesName || []);
    }
  }, [isOpen, taskDetails]);

  console.log("title", title);

  console.log("defaultFile", defaultFile);
  console.log("defaultFileName", defaultFileName);

  console.log("task id", taskDetails?.id);

  const deleteFile = (index: number) => {
    setHiddenFile((prev) => [...prev, index]);
    setDeleteIndex((prev) => [...prev, index]);
    // setDefaultFile((prev) => prev.filter((_, i) => i !== index));
    // setDefaultFileName((prev) => prev.filter((_, i) => i !== index));
  };

  console.log("delete gambar", deleteIndex);

  const handleFileChange = (index: number, newFile: File) => {
    // Cek file yang diupload
    console.log("newFile uploaded:", newFile);

    const newFileUrl = URL.createObjectURL(newFile);

    setReplaceIndex((prev) => [...prev, index]);
    // Memperbarui array defaultFile untuk menyimpan URL file yang baru

    setDefaultFile((prev) => {
      const updatedFiles = [...prev];
      updatedFiles[index] = newFileUrl; // Ganti URL file yang sesuai indeks
      return updatedFiles;
    });

    // Memperbarui array defaultFileName untuk menyimpan nama file yang baru
    setDefaultFileName((prev) => {
      const updatedNames = [...prev];
      updatedNames[index] = newFile.name; // Ganti nama file yang sesuai indeks
      return updatedNames;
    });

    // Memperbarui file yang telah diupload
    setFile((prev) => {
      const updatedFiles = prev ? [...prev] : [];
      updatedFiles[index] = newFile;
      return updatedFiles;
    });

    // Clean up the URL when file change is done
    return () => URL.revokeObjectURL(newFileUrl);
  };

  console.log("replaceIndex", replaceIndex);

  console.log("file", file);

  const handleSubmit = async () => {
    if (!title || !taskDetails?.id) return;

    const formattedStartDate = formatISO(new Date(startDate), {
      representation: "complete",
    });
    const formattedDueDate = formatISO(new Date(dueDate), {
      representation: "complete",
    });

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("status", status);
      formData.append("priority", priority);
      formData.append("tags", tags);
      formData.append("points", String(Number(points)));
      formData.append("startDate", formattedStartDate);
      formData.append("dueDate", formattedDueDate);
      formData.append(
        "assignedUserId",
        assignedUserId !== null ? String(assignedUserId) : "",
      );
      formData.append("projectId", String(Number(projectId)));

      // Jika ada file yang baru diupload, tambahkan ke FormData
      if (file && file.length > 0) {
        file.forEach((fileItem) => {
          formData.append("file", fileItem);
        });
      }

      // Menambahkan file lama (jika ada) ke FormData tanpa menggantinya
      defaultFile.forEach((fileUrl, index) => {
        const fileName = defaultFileName[index];
        formData.append("file", fileUrl); // Menyertakan URL file lama dalam FormData
        formData.append("fileName", fileName); // Menyertakan nama file lama dalam FormData
      });

      if (replaceIndex.length > 0) {
        replaceIndex.forEach((index) => {
          formData.append("replaceIndex", String(index));
        });
      }

      if (deleteIndex.length > 0) {
        deleteIndex.forEach((index) => {
          formData.append("deleteIndex", String(index));
        });
      }

      await updateTask({ id: taskDetails?.id, task: formData }).unwrap();
      resetState();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const resetState = () => {
    setTitle("");
    setDescription("");
    setStatus(Status.ToDo);
    setPriority(Priority.Backlog);
    setTags("");
    setStartDate("");
    setDueDate("");
    setAssignedUserId(null);
    setProjectId("");
    setPoints("");
    setDefaultFile([]);
    setDefaultFileName([]);
    setFile(null);
    setReplaceIndex([]);
    setDeleteIndex([]);
    setHiddenFile([]);
  };

  const handleClose = () => {
    resetState();
    onClose(); // Panggil fungsi `onClose` dari props untuk menutup modal
  };

  console.log("replaceIndex", replaceIndex);

  console.log("Assigned User ID", assignedUserId);

  const selectStyles =
    "mb-4 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";
  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  return (
    <Modal isOpen={isOpen} onClose={handleClose} name="Edit Task">
      <form
        className="mt-4 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          type="text"
          className={inputStyles}
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className={inputStyles}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <select
            className={selectStyles}
            value={status}
            onChange={(e) => setStatus(e.target.value as Status)}
          >
            <option value="">Select Status</option>
            <option value={Status.ToDo}>To Do</option>
            <option value={Status.WorkInProgress}>Work In Progress</option>
            <option value={Status.UnderReview}>Under Review</option>
            <option value={Status.Completed}>Completed</option>
          </select>
          <select
            className={selectStyles}
            value={priority}
            onChange={(e) =>
              setPriority(Priority[e.target.value as keyof typeof Priority])
            }
          >
            <option value="">Select Priority</option>
            <option value={Priority.Urgent}>Urgent</option>
            <option value={Priority.High}>High</option>
            <option value={Priority.Medium}>Medium</option>
            <option value={Priority.Low}>Low</option>
            <option value={Priority.Backlog}>Backlog</option>
          </select>
        </div>
        <input
          type="text"
          className={inputStyles}
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <input
            type="date"
            className={inputStyles}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className={inputStyles}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <input
          type="number"
          className={inputStyles}
          placeholder="Assigned User ID"
          value={assignedUserId !== null ? assignedUserId : ""}
          onChange={(e) =>
            setAssignedUserId(e.target.value ? Number(e.target.value) : null)
          }
        />
        {taskDetails?.id === null && (
          <input
            type="text"
            className={inputStyles}
            placeholder="ProjectId"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          />
        )}

        <div className="mt-4">
          <p className="text-sm font-semibold">File Terkait:</p>
          <ul className="mt-2 space-y-4">
            {defaultFile?.map((file: any, index: any) => {
              // Sembunyikan file jika ada di hiddenFiles
              if (hiddenFiles.includes(index)) return null;

              return (
                <li key={index} className="flex items-center space-x-2">
                  <a href={file} target="_blank" rel="noreferrer">
                    {defaultFileName[index]}
                  </a>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      id={`fileInput-${index}`}
                      className="hidden rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none"
                      onChange={(e) =>
                        handleFileChange(index, e.target.files![0])
                      }
                    />
                    <label
                      htmlFor={`fileInput-${index}`}
                      className="cursor-pointer rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
                    >
                      Ganti
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteFile(index)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <button
          type="submit"
          className={`focus-offset-2 mt-4 flex w-full cursor-pointer justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600`}
          // disabled={!isFormValid() || isLoading}
        >
          {isLoading ? "Updating..." : "Update Task"}
        </button>
      </form>
    </Modal>
  );
};

export default ModalEditTask;
