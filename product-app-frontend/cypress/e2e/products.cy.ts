
describe('Product Catalog Dashboard', () => {

  beforeEach(() => {
    cy.intercept('GET', '**/api/products*', {
      statusCode: 200,
      body: {
        items: [
          { id: '1234-abcd', code: 'CYP-01', name: 'Cypress Mocked Product', price: 150.00 }
        ],
        totalCount: 1
      }
    }).as('getProducts');

    cy.visit('/');
  });

  it('should display the product list from the API', () => {

    cy.wait('@getProducts');

    cy.get('.product-table').should('be.visible');
    cy.contains('td', 'CYP-01').should('be.visible');
    cy.contains('td', 'Cypress Mocked Product').should('be.visible');
  });

  it('should open dialog, fill the form and send POST request', () => {
    cy.intercept('POST', '**/api/products', {
      statusCode: 201,
      body: { id: '9999-zzzz', code: 'NEW-02', name: 'lodowka', price: 899.99 }
    }).as('addProduct');

    cy.contains('button', 'Add Product').click();

    cy.get('mat-dialog-container').should('be.visible');
    cy.contains('h2', 'Add New Product').should('be.visible');

    cy.get('input[formControlName="code"]').type('NEW-02');
    cy.get('input[formControlName="name"]').type('lodowka');
    cy.get('input[formControlName="price"]').type('899.99');

    cy.contains('button', 'Save').click();

    cy.wait('@addProduct').its('request.body').should('deep.equal', {
      code: 'NEW-02',
      name: 'lodowka',
      price: 899.99
    });

    cy.get('mat-dialog-container').should('not.exist');
  });

});