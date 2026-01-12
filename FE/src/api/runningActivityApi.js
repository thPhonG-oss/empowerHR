import axiosClient from "./axiosClient";

const runningActivityApi = {
  adminGetAllActivity: (pageNumber = 0, pageSize = 10) =>
    axiosClient.get(`/api/v1/activities/admin`, {
      params: { pageNumber, pageSize },
    }),

  employeeGetAllOpeningActivity: () => axiosClient.get(`/api/v1/activities`),

  employeeGetAllRegisteredActivity: (employeeId) =>
    axiosClient.get(`/api/v1/employees/${employeeId}/activities`),

  employeeRegisterActivity: (activityId) =>
    axiosClient.post(`/api/v1/participateIn/register/${activityId}`),

  employeeUnregisterActivity: (id) =>
    axiosClient.delete(`/api/v1/participateIn/${id}`),

  employeeGetResultActivities: (employeeId, activityId) =>
    axiosClient.get(`/api/v1/employees/${employeeId}/activities/${activityId}`),

  updateActivity: (runningActivityId, data) =>
    axiosClient.put(
      `/api/v1/activities/admin/update-activities/${runningActivityId}`,
      data
    ),

  deleteActivity: (activityId) =>
    axiosClient.delete(`/api/v1/activities/admin/${activityId}`),
};

export default runningActivityApi;
