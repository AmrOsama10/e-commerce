const generateMessage = (entity: string) => ({
  notFound: `${entity} not found`,
  alreadyExist: `${entity} already exist`,
  create: `${entity} create successfully`,
  update: `${entity} update successfully`,
  delete: `${entity} delete successfully`,
  failToCreate: `${entity} fail to create`,
  failToUpdate: `${entity} fail to update`,
  failToDelete: `${entity} fail to delete`,
});

export const MESSAGE = {
  User: { ...generateMessage('User') },
  Category: { ...generateMessage('Category') },
  Brand: { ...generateMessage('Brand') },
  Product: { ...generateMessage('Product') },
  Coupon: { ...generateMessage('Coupon') },
};
