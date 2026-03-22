using Product_API.Domain.Common;
using Product_API.DTOs;

namespace Product_API.Interfaces
{
    public interface IProductService
    {
        Task<PagedResult<ProductDto>> GetProductsAsync(string? searchTerm, int pageIndex, int pageSize, string? sortBy, string? sortDirection);
        Task<ProductDto> CreateProductAsync(CreateProductDto dto);
        Task<bool> UpdateProductAsync(Guid id, UpdateProductDto dto);
        Task<bool> DeleteProductAsync(Guid id);
    }
}
