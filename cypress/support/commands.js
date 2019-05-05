// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (user, pass, url) => {
  cy.clearCookies();
  cy.visit(url);
  cy.get('#inputUsername').type(user);
  cy.get('#inputPassword').type(pass);
  cy.get('button#loginButton').should('be.visible').click();
})

Cypress.Commands.add('logout', (user, pass) => {
  cy.wait(2000);
  cy.get('#logoutButton').click();
})


Cypress.Commands.add('addWatchItem', (itemPath) => {
  var cm = cy.get('.CodeMirror textarea').eq(1);
  cm.type(itemPath, { force: true });
  cy.contains('Item hinzufügen').click();
})

Cypress.Commands.add('removeWatchItem', (itemPath) => {
  cy.contains(itemPath).click();
  cy.contains(itemPath).should('not.exist');
})

Cypress.Commands.add('hashPassword', (password, result) => {
  cy.get('input#plainpass').should('be.visible').type(password);
  cy.get('button#create_hash').should('be.visible').click();
  cy.contains(result);
})
