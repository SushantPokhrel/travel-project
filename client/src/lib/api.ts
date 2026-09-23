const API_BASE_URL = import.meta.env.VITE_BASE_URL_API;

export const postData = async <PayloadType, ReturnType>(
  path: string,
  payload: PayloadType,
): Promise<ReturnType> => {
  console.log(payload);
  const isFormData = payload instanceof FormData;
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: isFormData
      ? {}
      : {
          "Content-Type": "application/json",
        },
    body: isFormData ? payload : JSON.stringify(payload),
    credentials: "include",
  });

  const resData = await res.json();
  if (!res.ok) {
    throw new Error(resData.message);
  }
  return resData;
};
export const patchData = async <PayloadType, ReturnType>(
  path: string,
  payload: PayloadType,
): Promise<ReturnType> => {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  const resData = await res.json();
  if (!res.ok) throw new Error(resData.message);
  return resData;
};
export const fetchUser = async <ReturnType>(): Promise<ReturnType> => {
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    credentials: "include",
  });
  const userData = await res.json();
  console.log(userData);
  if (!res.ok) {
    throw new Error(userData.message);
  }
  return userData;
};
export const logout = async (path: string) => {
  await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    credentials: "include",
  });
};
export const fetchData = async <ReturnType>(
  path: string,
): Promise<ReturnType> => {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error("Could not fetch data");
  return data;
};
