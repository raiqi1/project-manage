import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { result } from "lodash";

export interface Project {
  id: number;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  userTeam?: any[];
}

export enum Priority {
  Urgent = "Urgent",
  High = "High",
  Medium = "Medium",
  Low = "Low",
  Backlog = "Backlog",
}

export enum Status {
  ToDo = "To Do",
  WorkInProgress = "Work In Progress",
  UnderReview = "Under Review",
  Completed = "Completed",
}

export interface User {
  userId?: number;
  username: string;
  email: string;
  password: string;
  profilePictureUrl?: string;
  // cognitoId?: string;
  teamId?: number;
  user: any;
  token: string;
}

export interface Attachment {
  id: number;
  fileURL: string;
  fileName: string;
  taskId: number;
  uploadedById: number;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  tags?: string;
  startDate?: string;
  dueDate?: string;
  points?: number;
  projectId: number;
  authorUserId?: number;
  assignedUserId?: number;
  filesUrl?: string[];
  filesName?: string[];

  project?: Project;
  author?: User;
  assignee?: User;
  comments?: Comment[];
  attachments?: Attachment[];
}

export interface SearchResults {
  tasks?: Task[];
  projects?: Project[];
  users?: User[];
}

export interface Team {
  teamId: number;
  teamName: string;
  productOwnerUserId?: number;
  projectManagerUserId?: number;
}

export interface ProjectTeam {
  projectId: number;
  teamId: number;
  userId: number;
}

export const api = createApi({
  baseQuery: async (args, api, extraOptions) => {
    const baseQuery = fetchBaseQuery({
      baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
      prepareHeaders: (headers) => {
        const token = localStorage.getItem("token");
        if (token) {
          headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
      },
    });
    const result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
      localStorage.removeItem("token");
      // window.location.reload();
    }
    console.log("Base query result:", result);
    return result;
  },
  reducerPath: "api",
  tagTypes: ["Users", "Projects", "Tasks", "Teams"],
  endpoints: (build) => ({
    getUserLogin: build.query<User, void>({
      query: () => "users/get-user",
      providesTags: ["Users"],
    }),
    getProjects: build.query<Project[], void>({
      query: () => "projects/my-projects",
      providesTags: ["Projects"],
    }),
    getTasksForLogin: build.query<Task[], void>({
      query: () => "tasks/my-tasks",
      providesTags: ["Tasks"],
    }),
    getProjectTeams: build.query<ProjectTeam[], void>({
      query: () => {
        console.log("Fetching project teams...");
        return `projects-teams`;
      },
      providesTags: ["Teams"],
    }),
    createAccount: build.mutation<User, Partial<User>>({
      query: (user) => ({
        url: "users",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["Users"],
    }),
    createProject: build.mutation<Project, Partial<Project>>({
      query: (project) => ({
        url: "projects",
        method: "POST",
        body: project,
      }),
      invalidatesTags: ["Projects"],
    }),
    getTasks: build.query<Task[], { projectId: number }>({
      query: ({ projectId }) => `tasks?projectId=${projectId}`,
      providesTags: (result) =>
        result
          ? result.map(({ id }) => ({ type: "Tasks" as const, id }))
          : [{ type: "Tasks" as const }],
    }),
    getTasksByUser: build.query<Task[], number>({
      query: (userId) => `tasks/user/${userId}`,
      providesTags: (result, error, userId) =>
        result
          ? result.map(({ id }) => ({ type: "Tasks", id }))
          : [{ type: "Tasks", id: userId }],
    }),
    createTask: build.mutation<Task, FormData>({
      query: (formData) => ({
        url: "tasks",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Tasks"],
    }),
    getTaskDetails: build.query<Task, number>({
      query: (taskId) => `tasks/${taskId}`,
      providesTags: (result, error, taskId) =>
        result ? [{ type: "Tasks", id: taskId }] : [],
    }),
    updateTask: build.mutation<Task, { id: number; task: FormData }>({
      query: ({ id, task }) => ({
        url: `tasks/${id}`,
        method: "PUT",
        body: task,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Tasks", id }],
    }),
    updateTaskStatus: build.mutation<Task, { taskId: number; status: string }>({
      query: ({ taskId, status }) => ({
        url: `tasks/${taskId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Tasks", id: taskId },
      ],
    }),
    deleteTask: build.mutation<Task, { taskId: number }>({
      query: ({ taskId }) => ({
        url: `tasks/${taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { taskId }) => {
        console.log("Invalidating cache for task:", taskId);
        return [{ type: "Tasks", id: taskId }];
      },
      onQueryStarted: async ({ taskId }, { queryFulfilled }) => {
        try {
          const result = await queryFulfilled;
          console.log("Delete successful:", result);
        } catch (error) {
          console.error("Error deleting task:", error);
        }
        console.log("Task ID:", taskId);
      },
    }),
    getUsers: build.query<User[], void>({
      query: () => "users",
      providesTags: ["Users"],
    }),
    getTeams: build.query<Team[], void>({
      query: () => "teams",
      providesTags: ["Teams"],
    }),
    search: build.query<SearchResults, string>({
      query: (query) => `search?query=${query}`,
    }),
    login: build.mutation<
      { user: any; token: string },
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: "users/login",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const {
  useGetUserLoginQuery,
  useCreateAccountMutation,
  useGetProjectsQuery,
  useGetProjectTeamsQuery,
  useCreateProjectMutation,
  useGetTaskDetailsQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useGetTasksQuery,
  useGetTasksForLoginQuery,
  useCreateTaskMutation,
  useUpdateTaskStatusMutation,
  useSearchQuery,
  useGetUsersQuery,
  useGetTeamsQuery,
  useGetTasksByUserQuery,
  useLoginMutation,
} = api;
