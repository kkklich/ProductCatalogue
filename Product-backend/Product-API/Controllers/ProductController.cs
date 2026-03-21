using Microsoft.AspNetCore.Mvc;
using Product_API.Models;
using Product_API.Repositories;

namespace Product_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly ProductRepository _repository;

        public ProductController(ProductRepository repository)
        {
            _repository = repository;
        }
        // GET: api/product?search=fraza&pageIndex=0&pageSize=5
        [HttpGet]
        public IActionResult GetProducts([FromQuery] string? search, [FromQuery] int pageIndex = 0, [FromQuery] int pageSize = 5)
        {
            var result = _repository.GetPaged(search, pageIndex, pageSize);
            return Ok(result);
        }

        // POST: api/products
        [HttpPost]
        public IActionResult AddProduct([FromBody] Product product)
        {
            _repository.Add(product);
            return Ok(product);
        }

        // PUT: api/products/{id}
        [HttpPut("{id}")]
        public IActionResult UpdateProduct(Guid id, [FromBody] Product product)
        {
            if (!_repository.Update(id, product))
            {
                return NotFound();
            }
            return NoContent(); 
        }

        // DELETE: api/products/{id}
        [HttpDelete("{id}")]
        public IActionResult DeleteProduct(Guid id)
        {
            if (!_repository.Delete(id))
            {
                return NotFound();
            }
            return NoContent();
        }

    }
}
