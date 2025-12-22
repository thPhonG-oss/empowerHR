import axiosClient from "./axiosClient";

const stravaApi = {

  
//   getStatusconnetion: () => axiosClient.get(`/api/v1/activities`)
RedirectURL: () => axiosClient.get(`/api/v1/strava/connect`),

Oauth2: ({ state, code, scope }) =>
    axiosClient.post("/oauth2/callback", null, {
      params: {
        state,
        code,
        scope,
      },
    })

};

export default stravaApi;
