export const formatDate = (date?: any) => {
  return new Date(date || new Date()).toLocaleDateString();
};
