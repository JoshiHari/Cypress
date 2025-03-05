export function enterUserDetails() {
    cy.get("#first-name").type("Storm");
    cy.get("#last-name").type("Stormer");
    cy.get("#postal-code").type("234556");
}