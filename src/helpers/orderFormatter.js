const orderFormatter = order => {
  order = order.map(
    ({
      phoneNumber,
      location,
      foodName,
      foodPrice,
      quantity,
      restaurantId: { restaurantName },
      food,
    }) => {
      return {
        phoneNumber,
        location,
        foodName,
        foodPrice,
        food,
        quantity,
        restaurantName,
      };
    },
  );
  return order;
};

export default orderFormatter;
