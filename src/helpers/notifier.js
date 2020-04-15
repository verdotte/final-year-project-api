const notifier = (event, payload = null, connection) => {
  if (!!connection && connection.length > 0) {
    connection.forEach(socket => {
      socket.emit(event, payload);
    });
  }
};

export default notifier;
