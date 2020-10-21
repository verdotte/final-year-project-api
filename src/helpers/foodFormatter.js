/* eslint-disable no-undef */
const foodFormatter = food => {
  food = food.map(
    ({
      cookingTime,
      slug,
      _id,
      foodName,
      foodPrice,
      foodImage,
      restaurantId,
      numberOfOrder,
    }) => {
      return {
        cookingTime,
        slug,
        foodName,
        foodPrice,
        foodImage,
        foodId: _id,
        restaurantName: restaurantId.restaurantName,
        restaurantId: restaurantId._id,
        numberOfOrder,
      };
    },
  );
  return food;
};

export default foodFormatter;
