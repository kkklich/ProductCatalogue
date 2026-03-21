using Product_API.Models;

namespace Product_API.Repositories
{
    public class ProductRepository
    {
        private readonly List<Product> _products = new();

        public PagedResult<Product> GetPaged(string? searchTerm, int pageIndex, int pageSize)
        {
            var query = _products.AsEnumerable();

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                searchTerm = searchTerm.ToLower();
                query = query.Where(p =>
                    p.Name.ToLower().Contains(searchTerm) ||
                    p.Code.ToLower().Contains(searchTerm));
            }

            int totalCount = query.Count();

            // Apply pagination
            var items = query.Skip(pageIndex * pageSize).Take(pageSize).ToList();

            return new PagedResult<Product>
            {
                Items = items,
                TotalCount = totalCount
            };
        }

        public void Add(Product product)
        {
            _products.Add(product);
        }

        public bool Update(Guid id, Product updatedProduct)
        {
            var existing = _products.FirstOrDefault(p => p.Id == id);
            if (existing == null) return false;

            // Update properties
            existing.Code = updatedProduct.Code;
            existing.Name = updatedProduct.Name;
            existing.Price = updatedProduct.Price;

            return true;
        }

        public bool Delete(Guid id)
        {
            var product = _products.FirstOrDefault(p => p.Id == id);
            if (product == null) return false;

            _products.Remove(product);
            return true;
        }
    }
}
