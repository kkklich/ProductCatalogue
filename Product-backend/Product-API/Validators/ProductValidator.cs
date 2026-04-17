using FluentValidation;
using Product_API.Application.DTOs;
using Product_API.Application.DTOs.Interfaces;

namespace Product_API.Validators
{
    public class ProductValidator<T> : AbstractValidator<T> where T : IProductDto
    {
        public ProductValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Product name is required.")
                .MinimumLength(3)
                .MaximumLength(100).WithMessage("Name cannot exceed 100 characters.");

            RuleFor(x => x.Code)
                .NotEmpty().WithMessage("Product code is required.");

            RuleFor(x => x.Price)
                .GreaterThan(0).WithMessage("Price must be greater than zero.");
        }
    }
}
