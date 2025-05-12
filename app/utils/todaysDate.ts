export const getDate = () => new Date();

export const getFixedDate = () => getDate().toISOString().split("T")[0];

export const getWeekday = () => {
  const dayNumber = getDate().getDay();
  switch (dayNumber) {
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
    case 0:
      return "Sunday";
  }
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return (
    date.getDate() + " " + date.toLocaleString("default", { month: "long" })
  );
};
