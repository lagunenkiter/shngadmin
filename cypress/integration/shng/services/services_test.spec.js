/// <reference types="Cypress" />
context('Services: Services Tests', () => {
  beforeEach(function () {
    const user = 'admin';
    const pass = '1234';
    const url = Cypress.config().baseUrl+'/services';
    cy.login(user, pass, url);
    cy.contains('eibd').should('be.visible');
  })
  describe('Hashing Password Test', () => {
    it('hashes a numeric password', () => {
      cy.hashPassword('1234', 'd404559f602eab6fd602ac7680dacbfaadd13630335e951f097af3900e9de176b6db28512f2e000b9d04fba5133e8b1c6e8df59db3a8ab9d60be4b97cc9e81db')
    })
    it('hashes a alphanumeric password', () => {
      cy.hashPassword('1n2f3F4z', '55caa37438c5b169d60bdf9f037c809eb013e2595904ed5eac18738ed700ec2846f45ee32cbab5f5fce471e2edfe1f4b538c678516693874f53500e48d4aeb54')
    })
    it('hashes a password with special characters', () => {
      cy.hashPassword('4324&%/.-.423%%"!', 'ea94428b3e039e496bd9ad120e7d816b27ebfdc8f70b9fc3a55cba6962c1e3249a0589e84523c8d6c5ae992fe492e093fb9d5694a04b73d5ef4bda03b1f5c210')
    })
  });
});
