exports.getPagination = (page, limit) => {
  const currentPage = parseInt(page) || 1;
  const perPage = parseInt(limit) || 10;
  const offset = (currentPage - 1) * perPage;

  return { currentPage, perPage, offset };
};
