using AutoMapper;
using Product_API.DTOs;
using Product_API.Interfaces;
using Product_API.Models;

namespace ProductCatalogApi.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _repository;
        private readonly IMapper _mapper;

        public ProductService(IProductRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<PagedResult<ProductDto>> GetProductsAsync(string? searchTerm, int pageIndex, int pageSize, string? sortBy, string? sortDirection)
        {
            var pagedResult = await _repository.GetPagedAsync(searchTerm, pageIndex, pageSize, sortBy, sortDirection);

            var dtos = _mapper.Map<List<ProductDto>>(pagedResult.Items);

            return new PagedResult<ProductDto>
            {
                Items = dtos,
                TotalCount = pagedResult.TotalCount
            };
        }

        public async Task<ProductDto> CreateProductAsync(CreateProductDto dto)
        {
            var newProduct = _mapper.Map<Product>(dto);
            newProduct.Id = Guid.NewGuid();

            await _repository.AddAsync(newProduct);

            return _mapper.Map<ProductDto>(newProduct);
        }

        public async Task<bool> UpdateProductAsync(Guid id, UpdateProductDto dto)
        {
            var existingProduct = await _repository.GetByIdAsync(id);
            if (existingProduct == null) return false;

            _mapper.Map(dto, existingProduct);

            return await _repository.UpdateAsync(existingProduct);

        }

        public async Task<bool> DeleteProductAsync(Guid id)
        {
            return await _repository.DeleteAsync(id);
        }
    }
}