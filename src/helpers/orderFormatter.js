const orderFormatter = order => {
  order = order.map(
    ({
      phoneNumber,
      location,
      foodName,
      foodPrice,
      quantity,
      restaurantId: { restaurantName },
    }) => {
      return {
        phoneNumber,
        location,
        foodName,
        foodPrice,
        quantity,
        restaurantName,
      };
    },
  );
  return order;
};

export default orderFormatter;
