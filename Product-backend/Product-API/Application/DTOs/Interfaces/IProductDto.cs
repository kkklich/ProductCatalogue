namespace Product_API.Application.DTOs.Interfaces
{
    public interface IProductDto
    {   
        string Name { get; }
        string Code { get; }
        decimal Price { get; }
    }
}
