namespace Product_API.Application.DTOs
{
    public class CreateProductDto
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
    }
}
