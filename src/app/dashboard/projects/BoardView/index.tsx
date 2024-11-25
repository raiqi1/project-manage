/* eslint-disable @next/next/no-img-element */
import {
  useDeleteTaskMutation,
  useGetProjectsQuery,
  useGetProjectTeamsQuery,
  useGetTaskDetailsQuery,
  useGetTasksQuery,
  useUpdateTaskStatusMutation,
} from "@/state/api";
import React, { useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Task as TaskType } from "@/state/api";
import { EllipsisVertical, MessageSquareMore, Plus } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import ModalEditTask from "@/components/ModalEditTask";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type BoardProps = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const taskStatus = ["To Do", "Work In Progress", "Under Review", "Completed"];

const BoardView = ({ id, setIsModalNewTaskOpen }: BoardProps) => {
  const {
    data: tasks,
    isLoading,
    error,
    refetch,
  } = useGetTasksQuery({ projectId: Number(id) });
  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  console.log("data my tasks", tasks);

  const { data: project } = useGetProjectsQuery();
  console.log("data my project", project);

  const { data: projectTeams } = useGetProjectTeamsQuery();
  console.log("data my project teams", projectTeams);

  const moveTask = (taskId: number, toStatus: string) => {
    updateTaskStatus({ taskId, status: toStatus });
  };

  useEffect(() => {
    refetch();
  }, [id, refetch]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred while fetching tasks</div>;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
        {taskStatus.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasks || []}
            moveTask={moveTask}
            setIsModalNewTaskOpen={setIsModalNewTaskOpen}
          />
        ))}
      </div>
    </DndProvider>
  );
};

type TaskColumnProps = {
  status: string;
  tasks: TaskType[];
  moveTask: (taskId: number, toStatus: string) => void;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const TaskColumn = ({
  status,
  tasks,
  moveTask,
  setIsModalNewTaskOpen,
}: TaskColumnProps) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item: { id: number }) => moveTask(item.id, status),
    collect: (monitor: any) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const tasksCount = tasks.filter((task) => task.status === status).length;

  const statusColor: any = {
    "To Do": "#2563EB",
    "Work In Progress": "#059669",
    "Under Review": "#D97706",
    Completed: "#000000",
  };

  const searchParams = useSearchParams();
  const isTeamQuery = searchParams.get("team") === "true";
  console.log("isTeamQuery", isTeamQuery);

  return (
    <div
      ref={(instance) => {
        drop(instance);
      }}
      className={`sl:py-4 rounded-lg py-2 xl:px-2 ${isOver ? "bg-blue-100 dark:bg-neutral-950" : ""}`}
    >
      <div className="mb-3 flex w-full">
        <div
          className={`w-2 !bg-[${statusColor[status]}] rounded-s-lg`}
          style={{ backgroundColor: statusColor[status] }}
        />
        <div className="flex w-full items-center justify-between rounded-e-lg bg-white px-5 py-4 dark:bg-dark-secondary">
          <h3 className="flex items-center text-lg font-semibold dark:text-white">
            {status}{" "}
            <span
              className="ml-2 inline-block rounded-full bg-gray-200 p-1 text-center text-sm leading-none dark:bg-dark-tertiary"
              style={{ width: "1.5rem", height: "1.5rem" }}
            >
              {tasksCount}
            </span>
          </h3>
          <div className="flex items-center gap-1">
            <button className="flex h-6 w-5 items-center justify-center dark:text-neutral-500">
              <EllipsisVertical size={26} />
            </button>
            <button
              className="flex h-6 w-6 items-center justify-center rounded bg-gray-200 dark:bg-dark-tertiary dark:text-white"
              onClick={() => setIsModalNewTaskOpen(true)}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>

      {tasks
        .filter((task) => task.status === status)
        .map((task) => (
          <Task key={task.id} task={task} />
        ))}
    </div>
  );
};

type TaskProps = {
  task: TaskType;
};

const Task = ({ task }: TaskProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor: any) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const {
    data: taskDetails,
    isLoading,
    error,
    refetch,
  } = useGetTaskDetailsQuery(task.id);

  const [deleteTask, { isLoading: isDeleting, error: deleteError }] =
    useDeleteTaskMutation();

  const handleDeleteTask = () => {
    if (task.id) {
      deleteTask({ taskId: task.id });
    }
  };

  // useEffect(() => {
  //   if (task.id) {
  //   }
  // }, [task.id, refetch]);

  const taskTagsSplit = task.tags ? task.tags.split(",") : [];

  const formattedStartDate = task.startDate
    ? format(new Date(task.startDate), "P")
    : "";
  const formattedDueDate = task.dueDate
    ? format(new Date(task.dueDate), "P")
    : "";

  const numberOfComments = (task.comments && task.comments.length) || 0;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleOpenModal = () => setIsModalOpen(true);

  const handleOpenEditModal = () => setIsEditModalOpen(true);
  const handleCloseEditModal = () => setIsEditModalOpen(false);

  const PriorityTag = ({ priority }: { priority: TaskType["priority"] }) => (
    <div
      className={`rounded-full px-2 py-1 text-xs font-semibold ${
        priority === "Urgent"
          ? "bg-red-200 text-red-700"
          : priority === "High"
            ? "bg-yellow-200 text-yellow-700"
            : priority === "Medium"
              ? "bg-green-200 text-green-700"
              : priority === "Low"
                ? "bg-blue-200 text-blue-700"
                : "bg-gray-200 text-gray-700"
      }`}
    >
      {priority}
    </div>
  );

  console.log("taskId", task.id);

  // console.log("taskDetails", taskDetails);

  return (
    <div
      ref={(instance) => {
        drag(instance);
      }}
      className={`mb-4 rounded-md bg-white shadow dark:bg-dark-secondary ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      {/* {task.attachments && task.attachments.length > 0 && (
        <Image
          src={`https://pm-s3-images1.s3.amazonaws.com/${task.attachments[0].fileURL}`}
          alt={task.attachments[0].fileName}
          width={400}
          height={200}
          className="h-auto w-full rounded-t-md"
        />
      )} */}
      <ModalEditTask
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        taskDetails={taskDetails}
      />
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-4 shadow-lg dark:bg-dark-secondary">
            <h3 className="mb-4 text-lg font-semibold">Task Options</h3>
            <button
              className="mb-2 w-full rounded bg-blue-500 px-4 py-2 text-white"
              onClick={() => {
                /* handle edit logic here */
                handleOpenEditModal();
                handleCloseModal();
              }}
            >
              Edit
            </button>
            <button
              className="w-full rounded bg-red-500 px-4 py-2 text-white"
              onClick={() => {
                /* handle delete logic here */
                handleDeleteTask();
                handleCloseModal();
              }}
            >
              Delete
            </button>
            <button
              className="mt-4 w-full rounded bg-gray-300 px-4 py-2 text-black dark:bg-neutral-700 dark:text-white"
              onClick={handleCloseModal}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className="p-4 md:p-6">
        <div className="flex items-start justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            {task.priority && <PriorityTag priority={task.priority} />}
            <div className="flex gap-2">
              {taskTagsSplit.map((tag) => (
                <div
                  key={tag}
                  className="rounded-full bg-blue-100 px-2 py-1 text-xs"
                >
                  {" "}
                  {tag}
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={handleOpenModal}
            className="flex h-6 w-4 flex-shrink-0 items-center justify-center dark:text-neutral-500"
          >
            <EllipsisVertical size={26} />
          </button>
        </div>

        <div className="my-3 flex justify-between">
          <h4 className="text-md font-bold dark:text-white">{task.title}</h4>
          {typeof task.points === "number" && (
            <div className="text-xs font-semibold dark:text-white">
              {task.points} pts
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500 dark:text-neutral-500">
          {formattedStartDate && <span>{formattedStartDate} - </span>}
          {formattedDueDate && <span>{formattedDueDate}</span>}
        </div>
        <p className="text-sm text-gray-600 dark:text-neutral-500">
          {task.description}
        </p>
        <div className="mt-4 border-t border-gray-200 dark:border-stroke-dark" />

        {/* image or pdf */}
        <div>
        </div>
        {task?.filesUrl && task?.filesUrl?.length > 0 && (
          <div className="mt-4">
            <div>
              <h3 className="text-sm font-semibold dark:text-white">
                Attachments
              </h3>
            </div>
            {task?.filesUrl.map((file, index) => {
              const fileExtension = file?.split(".").pop()?.toLowerCase();
              const isImage = [
                "jpg",
                "jpeg",
                "png",
                "gif",
                "bmp",
                "webp",
              ].includes(fileExtension || "");

              return isImage ? (
                <>
                  <Link href={file} target="_blank" rel="noopener noreferrer">
                    <img
                      key={index}
                      src={file}
                      alt={task?.filesName && task?.filesName[index]}
                      className="mt-2 block h-[3vw] w-[3vw] max-w-xs rounded shadow-md"
                    />
                  </Link>
                </>
              ) : (
                <a
                  key={index}
                  href={file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block text-blue-500 dark:text-blue-400"
                >
                  {(task?.filesName && task?.filesName[index]) ||
                    "Download File"}
                </a>
              );
            })}
          </div>
        )}

        {/* Users */}
        {/* <div className="mt-3 flex items-center justify-between">
          <div className="flex -space-x-[6px] overflow-hidden">
            {task.assignee && (
              <Image
                key={task.assignee.userId}
                src={`https://pm-s3-images1.s3.amazonaws.com/${task.assignee.profilePictureUrl!}`}
                alt={task.assignee.username}
                width={30}
                height={30}
                className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
              />
            )}
            {task.author && (
              <Image
                key={task.author.userId}
                src={`https://pm-s3-images1.s3.amazonaws.com/${task.author.profilePictureUrl!}`}
                alt={task.author.username}
                width={30}
                height={30}
                className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
              />
            )}
          </div>
          <div className="flex items-center text-gray-500 dark:text-neutral-500">
            <MessageSquareMore size={20} />
            <span className="ml-1 text-sm dark:text-neutral-400">
              {numberOfComments}
            </span>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default BoardView;
