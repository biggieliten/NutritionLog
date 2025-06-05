export const randomId = (string: string) => {
  const id = `${string}` + Math.random().toString(16).slice(2);
  return id;
};
