using Product_API.Models;

namespace Product_API.Repositories
{
    public class ProductRepository
    {
        private readonly List<Product> _products = new();

        // Repositories/ProductRepository.cs
        public PagedResult<Product> GetPaged(string? searchTerm, int pageIndex, int pageSize, string? sortBy, string? sortDirection)
        {
            var query = _products.AsEnumerable();

            // 1. Filtrowanie (Search)
            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                searchTerm = searchTerm.ToLower();
                query = query.Where(p =>
                    p.Name.ToLower().Contains(searchTerm) ||
                    p.Code.ToLower().Contains(searchTerm));
            }

            // 2. Sortowanie
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
                // Domyślne zachowanie, jeśli nie wybrano kolumny
                query = query.OrderBy(p => p.Id);
            }

            // 3. Obliczenie całkowitej liczby i Paginacja
            int totalCount = query.Count();
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
