import { useEffect, useState } from "react";

const baseURL = `https://jsonplaceholder.typicode.com`;

export const useFetch = <T>(endpoint: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    setLoading(true);
    setError(null);
    // controller for this effect run
    const controller = new AbortController();
    const { signal } = controller;
    async function fetchData() {
      try {
        const res = await fetch(`${baseURL}${endpoint}`, {
          signal,
        });
        if (!res.ok) {
          throw new Error("internal server error, could not fetch"); // catch block catches the error
        }
        const res_data: T = await res.json();
        console.log(res_data);
        setData(res_data);
        setLoading(false);
        setError(null);
      } catch (e: any) {
        if (e.name !== "AbortError") {
          setError(e.message || "network error, could not fetch");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    return () => controller.abort();
  }, [endpoint]);
  return { data, loading, error };
};
