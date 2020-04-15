const foodFormatter = food => {
  food = food.map(
    ({
      cookingTime,
      slug,
      foodName,
      foodPrice,
      foodImage,
      restaurantId: { restaurantName, _id },
    }) => {
      return {
        cookingTime,
        slug,
        foodName,
        foodPrice,
        foodImage,
        restaurantName,
        restaurantId: _id,
      };
    },
  );
  return food;
};

export default foodFormatter;
