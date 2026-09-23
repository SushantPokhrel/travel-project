const API_BASE_URL = import.meta.env.VITE_BASE_URL_API;

export const postData = async <PayloadType, ReturnType>(
  path: string,
  payload: PayloadType,
): Promise<ReturnType> => {
  console.log(payload);
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  const resData = await res.json();
  if (!res.ok) {
    throw new Error(resData.message);
  }
  return resData;
};
export const fetchUser = async <ReturnType>(): Promise<ReturnType> => {
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    credentials: "include",
  });
  const userData = await res.json();
  console.log(userData)
  if (!res.ok) {
    throw new Error(userData.message);
  }
  return userData;
};
