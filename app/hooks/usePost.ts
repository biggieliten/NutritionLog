// import { useState } from "react";

// export const usePost = <T>(url: string) => {
//   const [data, setData] = useState(null);
//   const [err, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const requestPost = async (body: T, method: string) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await fetch(url, {
//         method: method,
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(body),
//       });

//       if (!response.ok) {
//         throw new Error(
//           `An error occurred while fetching the data: ${response.statusText}`
//         );
//       }

//       const jsonData = await response.json();

//       setData(jsonData);
//       return jsonData;
//     } catch (error: any) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };
//   return { data, err, loading, requestPost };
// };
import { useState } from "react";

export const usePost = <T>(url: string) => {
  const [data, setData] = useState(null);
  const [err, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const requestPost = async (body: T, method: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Sending request to:", url);
      console.log("Request body in usePost (json):", JSON.stringify(body));

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(
          `An error occurred while fetching the data: ${response.statusText}`
        );
      }

      const jsonData = await response.json();
      console.log("Response data in usePost:", jsonData);

      setData(jsonData);
      return jsonData;
    } catch (error: any) {
      console.error("Request error:", error.message, error.stack, error.name);
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };
  return { data, err, loading, requestPost };
};
