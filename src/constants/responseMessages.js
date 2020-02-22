const general = (resource, action) =>
  `${resource} has been ${action} successfully`;

export const deleted = resource => general(resource, 'deleted');
export const created = resource => general(resource, 'created');
export const updated = resource => general(resource, 'updated');
export const notExist = resource => `${resource} does not exist`;
