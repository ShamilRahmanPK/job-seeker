import commonAPI from "./commonAPI";
import { SERVER_BASE_URL } from "./serverURL";

// Register
export const registerAPI = async (userData) => {
  return await commonAPI("POST", `${SERVER_BASE_URL}/register`, userData);
};

// Login
export const loginAPI = async (userData) => {
  return await commonAPI("POST", `${SERVER_BASE_URL}/login`, userData)
};

export const createJobAPI = async (reqBody, reqHeader) =>
  await commonAPI("post", `${SERVER_BASE_URL}/create-job`, reqBody,reqHeader);

export const updateJobAPI = async (id, data, token) =>
  await commonAPI("put", `${SERVER_BASE_URL}/jobs/${id}`, data, {
    Authorization: `Bearer ${token}`,
  });

export const deleteJobAPI = async (id, token) =>
  await commonAPI("delete", `${SERVER_BASE_URL}/jobs/${id}`, null, {
    Authorization: `Bearer ${token}`,
  });

export const getAllJobsAPI = async () =>
  await commonAPI("get", `${SERVER_BASE_URL}/jobs`);

export const getJobByIdAPI = async (id) =>
  await commonAPI("get", `${SERVER_BASE_URL}/jobs/${id}`);


// seeker api
export const createApplicationAPI = async (data, token) =>
  await commonAPI("post", `${SERVER_BASE_URL}/applications`, data, {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  });


export const saveJobAPI = async (userId, jobId, token) =>
  await commonAPI("put", `${SERVER_BASE_URL}/users/save-job`, { userId, jobId }, {
    Authorization: `Bearer ${token}`,
  });

//applications submitted by the current user
export const getMyApplicationsAPI = async (token) =>
  await commonAPI("get", `${SERVER_BASE_URL}/my-applications`, null, {
  Authorization: `Bearer ${token}`,
});

