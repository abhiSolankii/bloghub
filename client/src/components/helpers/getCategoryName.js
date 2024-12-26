const categories = [
  { value: 1, name: "Food" },
  { value: 2, name: "Technology" },
  { value: 3, name: "Education" },
];

const getCategoryName = (topic) => {
  const category = categories.find((item) => item.value === topic);
  const categoryName = category ? category.name : "Category not found";
  return categoryName;
};

export default getCategoryName;
