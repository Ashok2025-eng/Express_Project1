export const getPagination = (
  currentPage: number,
  perPage: number,
  totalCount: number,
) => {
  const totalPages = Math.ceil(totalCount / perPage);
  const pagination = {
    page: currentPage,
    limit: perPage,
    totalPages: 1,
    nextPage: currentPage < totalPages ? currentPage + 1 : null,
    prevPage: currentPage > 1 ? currentPage - 1 : null,
    total: 10,
  };
};
