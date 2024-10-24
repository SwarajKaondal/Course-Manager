const BACKEND_URL = "http://localhost:5500";

export const PostRequest = async (url: string, data: any): Promise<Response> => {
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
}
