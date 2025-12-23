import axiosClient from "./axiosClient";

const stravaApi = {
  getStatusconnetion: (employeeId) =>
    axiosClient.get(`/api/v1/employees/${employeeId}/connection`, {
      params: { employeeId },
    }),

  RedirectURL: () => axiosClient.get(`/api/v1/strava/connect`),

  Oauth2: ({ state, code, scope }) =>
    axiosClient.post("/oauth2/callback", null, {
      params: {
        state,
        code,
        scope,
      },
    }),
};

export default stravaApi;
