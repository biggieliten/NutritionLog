import { useState, useEffect } from "react";

export const useGet = <T>(
  url: string
): { data: T | null; loading: boolean; error: string | null } => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) {
      setData(null);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(
            `An error occurred while fetching the data: ${response.statusText}`
          );
        }

        const jsonData = await response.json();
        console.log("Full Response:", jsonData);

        if (jsonData.product) {
          console.log(
            "Product Found:",
            jsonData.product.nutriments["energy-kcal_100g"]
          );
          setData(jsonData as T);
        } else {
          console.error("No product in response:", jsonData);
          setData(null);
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};
