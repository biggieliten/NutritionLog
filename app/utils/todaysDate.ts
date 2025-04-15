export const getToday = () => new Date().toISOString().split("T")[0];

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return (
    date.getDate() + " " + date.toLocaleString("default", { month: "long" })
  );
};
