import axiosClient from "./axiosClient";

const runningActivityApi = {
  adminGetAllActivity: (pageNumber = 0, pageSize = 10) =>
    axiosClient.get(`/api/v1/activities/admin`, {
      params: { pageNumber, pageSize },
    }),
  updateActivity: (runningActivityId, data) =>
    axiosClient.put(
      `/api/v1/activities/admin/update-activities/${runningActivityId}`,
      data
    ),
  deleteActivity: (activityId) =>
    axiosClient.delete(`/api/v1/activities/admin/${activityId}`),
};

export default runningActivityApi;
