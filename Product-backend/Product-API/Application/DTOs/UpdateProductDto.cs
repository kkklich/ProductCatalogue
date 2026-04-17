using Product_API.Application.DTOs.Interfaces;

namespace Product_API.Application.DTOs
{
    public class UpdateProductDto: IProductDto
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
    }
}
