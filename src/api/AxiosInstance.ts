import axios, { AxiosRequestConfig } from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://discovery-api.afel.xyz/",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const clientId: string | undefined = process.env.NEXT_PUBLIC_AFEL_CLIENT_ID;
    const clientSecret: string | undefined =
      process.env.NEXT_PUBLIC_AFEL_CLIENT_SECRET;
    const apiKey: string | undefined = process.env.NEXT_PUBLIC_AFEL_API_KEY;

    if (!clientId || !clientSecret || !apiKey) {
      throw new Error("Missing environment variables");
    }

    config.headers.set("x-api-key", apiKey);
    config.headers.set("x-client-id", clientId);
    config.headers.set("x-client-secret", clientSecret);

    return config;
  },
  (error) => Promise.reject(error)
);

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {

//       window.location.href = "/";
//     }
//     return Promise.reject(error);
//   }
// );

export const getAxiosInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<T> => {
  const source = axios.CancelToken.source();

  const promise = axiosInstance({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // @ts-expect-error: Extend the promise object with a custom cancel method
  promise.cancel = () => {
    source.cancel("Query was cancelled");
  };

  return promise;
};
