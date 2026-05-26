import {createApi,fetchBaseQuery,} from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import {API_URL,TOKEN_KEY,} from "@/lib/constants";

export const baseApi = createApi({
  reducerPath: "baseApi",

  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,

    prepareHeaders: (headers) => {
      const token =
        Cookies.get(TOKEN_KEY);

      if (token) {
        headers.set(
          "Authorization",
          `Bearer ${token}`
        );
      }

      return headers;
    },
  }),

  tagTypes: [
    "Auth","Dashboard","Projects","Tasks","Shifts",
  ],

  endpoints: () => ({}),
});