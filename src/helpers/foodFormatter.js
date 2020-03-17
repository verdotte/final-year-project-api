const foodFormatter = food => {
  food = food.map(
    ({
      cookingTime,
      slug,
      foodName,
      foodPrice,
      foodImage,
      restaurantId: { restaurantName },
    }) => {
      return {
        cookingTime,
        slug,
        foodName,
        foodPrice,
        foodImage,
        restaurantName,
      };
    },
  );
  return food;
};

export default foodFormatter;
