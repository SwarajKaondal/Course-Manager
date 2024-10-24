const BACKEND_URL = "http://127.0.0.1:5000";

export const PostRequest = async (
  url: string,
  data: any
): Promise<Response> => {
  const fetchUrl = `${BACKEND_URL}${url}`;
  console.log(fetchUrl);
  return await fetch(fetchUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify(data),
  });
};

export const GetRequest = async (url: string): Promise<Response> => {
  const fetchUrl = `${BACKEND_URL}${url}`;
  console.log(fetchUrl);
  return await fetch(fetchUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
  });
};
