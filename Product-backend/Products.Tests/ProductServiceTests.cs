using AutoMapper;
using Moq;
using Product_API.Application.DTOs;
using Product_API.Application.Mappings;
using Product_API.Application.Services;
using Product_API.Domain.Common;
using Product_API.Domain.Entities;
using Product_API.Infrastructure.Repositories;
using System;
using System.Collections.Generic;
using System.Text;

namespace Products.Tests
{
    public class ProductServiceTests
    {

        private readonly IMapper _mapper;
        private readonly Mock<IProductRepository> _mockRepo;
        private readonly ProductService _service;

        public ProductServiceTests()
        {
            var mapperConfig = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile(new MappingProfile());
            });
            _mapper = mapperConfig.CreateMapper();

            _mockRepo = new Mock<IProductRepository>();

            _service = new ProductService(_mockRepo.Object, _mapper);
        }

        [Fact]
        public async Task CreateProductAsync_ShouldReturnMappedProductDto_AndGenerateNewId()
        {
            var createDto = new CreateProductDto
            {
                Code = "TEST-01",
                Name = "Test Product",
                Price = 99.99m
            };

            _mockRepo.Setup(repo => repo.AddAsync(It.IsAny<Product>()))
                     .Returns(Task.CompletedTask);

           
            var result = await _service.CreateProductAsync(createDto);

            Assert.NotNull(result);
            Assert.Equal(createDto.Code, result.Code);
            Assert.Equal(createDto.Name, result.Name);
            Assert.Equal(createDto.Price, result.Price);

            Assert.NotEqual(Guid.Empty, result.Id);

            _mockRepo.Verify(repo => repo.AddAsync(It.IsAny<Product>()), Times.Once);
        }

        [Fact]
        public async Task GetProductsAsync_ShouldReturnPagedResultOfProductDto()
        {
            var fakeProducts = new List<Product>
            {
                new Product { Id = Guid.NewGuid(), Code = "A1", Name = "Laptop", Price = 3000m },
                new Product { Id = Guid.NewGuid(), Code = "A2", Name = "Mouse", Price = 100m }
            };
            var fakePagedResult = new PagedResult<Product> { Items = fakeProducts, TotalCount = 2 };

            _mockRepo.Setup(repo => repo.GetPagedAsync("Laptop", 0, 5, null, null))
                     .ReturnsAsync(fakePagedResult);

            var result = await _service.GetProductsAsync("Laptop", 0, 5, null, null);

            Assert.NotNull(result);
            Assert.Equal(2, result.TotalCount);

            Assert.IsType<List<ProductDto>>(result.Items);
            Assert.Contains(result.Items, item => item.Code == "A1");

            _mockRepo.Verify(repo => repo.GetPagedAsync("Laptop", 0, 5, null, null), Times.Once);
        }
    }
}
