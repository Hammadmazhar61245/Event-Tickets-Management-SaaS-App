export const paginate = (model, page = 1, limit = 10, query = {}, populate = '') => {
  const skip = (page - 1) * limit;
  return model.find(query).skip(skip).limit(limit).populate(populate);
};