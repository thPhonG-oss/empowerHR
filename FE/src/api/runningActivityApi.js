import axiosClient from "./axiosClient";

const runningActivityApi = {
  adminGetAllActivity: (pageNumber = 0, pageSize = 10) =>
    axiosClient.get(`/api/v1/activities/admin`, {
      params: { pageNumber, pageSize },
    }),

  employeeGetAllOpeningActivity: () => axiosClient.get(`/api/v1/activities`),

  employeeGetAllRegisteredActivity: (employeeID) =>
    axiosClient.get(`/api/v1/employees/${employeeID}/activities`, {
      params: { employeeID },
    }),

  employeeRegisterActivity: (activityId) =>
    axiosClient.post(`/api/v1/participateIn/register/${activityId}`, {
      params: { activityId },
    }),

  employeeUnregisterActivity: (activityId) =>
    axiosClient.delete(`/api/v1/participateIn/${activityId}`, {
      params: { activityId },
    }),

  employeeGetResultActivities: (employeeId, activityId) =>
    axiosClient.get(
      `/api/v1/employees/${employeeId}/activities/${activityId}`,
      {
        params: { employeeId, activityId },
      }
    ),
  updateActivity: (runningActivityId, data) =>
    axiosClient.put(
      `/api/v1/activities/admin/update-activities/${runningActivityId}`,
      data
    ),
  deleteActivity: (activityId) =>
    axiosClient.delete(`/api/v1/activities/admin/${activityId}`),
};

export default runningActivityApi;
