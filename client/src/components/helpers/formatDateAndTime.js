const formatDateAndTime = (date) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(date).toLocaleDateString("en-GB", options);
};

export default formatDateAndTime;
