using Product_API.Domain.Common;
using Product_API.Domain.Entities;

namespace Product_API.Interfaces
{
    public interface IProductRepository
    {
        Task<PagedResult<Product>> GetPagedAsync(string? searchTerm, int pageIndex, int pageSize, string? sortBy, string? sortDirection);
        Task<Product?> GetByIdAsync(Guid id);
        Task AddAsync(Product product);
        Task<bool> UpdateAsync(Product product);
        Task<bool> DeleteAsync(Guid id);
    }
}
