using Product_API.Domain.Common;
using Product_API.Domain.Entities;

namespace Product_API.Infrastructure.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly List<Product> _products = new();

        public async Task<PagedResult<Product>> GetPagedAsync(string? searchTerm, int pageIndex, int pageSize, string? sortBy, string? sortDirection)
        {
            var query = _products.AsEnumerable();

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                searchTerm = searchTerm.ToLower();
                query = query.Where(p => p.Name.ToLower().Contains(searchTerm) || p.Code.ToLower().Contains(searchTerm));
            }

            if (!string.IsNullOrWhiteSpace(sortBy))
            {
                bool isDesc = sortDirection?.ToLower() == "desc";
                query = sortBy.ToLower() switch
                {
                    "code" => isDesc ? query.OrderByDescending(p => p.Code) : query.OrderBy(p => p.Code),
                    "name" => isDesc ? query.OrderByDescending(p => p.Name) : query.OrderBy(p => p.Name),
                    "price" => isDesc ? query.OrderByDescending(p => p.Price) : query.OrderBy(p => p.Price),
                    _ => query.OrderBy(p => p.Id)
                };
            }
            else
            {
                query = query.OrderBy(p => p.Id);
            }

            int totalCount = query.Count();
            var items = query.Skip(pageIndex * pageSize).Take(pageSize).ToList();

            return await Task.FromResult(new PagedResult<Product> { Items = items, TotalCount = totalCount });
        }

        public async Task<Product?> GetByIdAsync(Guid id)
        {
            var product = _products.FirstOrDefault(p => p.Id == id);
            return await Task.FromResult(product);
        }

        public async Task AddAsync(Product product)
        {
            _products.Add(product);
            await Task.CompletedTask;
        }

        public async Task<bool> UpdateAsync(Product product)
        {
            return await Task.FromResult(true);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var product = _products.FirstOrDefault(p => p.Id == id);
            if (product == null) return await Task.FromResult(false);

            _products.Remove(product);
            return await Task.FromResult(true);
        }
    }
}