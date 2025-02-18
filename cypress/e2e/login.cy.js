describe('Logging Scenarios', () => {
  it('Navigate to the home page with correct credentials', () => {

    // Navigating to the login page and entering the credentials
    cy.visit('https://www.saucedemo.com/')
    cy.get('#user-name').type("standard_user")
    cy.get('#password').type("secret_sauce")
    cy.get('#login-button').click()


    // Assertion to check "Home Page is displayed after logging in"
    cy.url().should('contain','inventory.html')
  })

  it('Error message on entering the wrong username/password', () => {

    cy.visit('https://www.saucedemo.com/')

    // Setting the viewport height
    cy.viewport(1000,800)
    cy.get('#user-name').type("standard_user")
    cy.get('#password').type("secret_sce")
    cy.get('#login-button').click()

    // Assert - 1: Error message background should be red
    cy.get('.error-message-container').invoke('css','background-color').should('include','rgb(226, 35, 26)')  

    // Assert - 2: Error message should specify wrong username or password
    cy.get('.error-message-container').find('h3').invoke('text').should('contain','Username and password do not match any user')

    //Clear the error message and the labels with the close button
    cy.get('.error-message-container').find('.error-button').click()

    // Check if that error message div is  visible
    // I'm leaving it for now but need to check how to do this with the visibillity check when a DOM element still exists

    cy.get('.error-message-container').should('be.visible')
  })

  it('Verify the user cannot login with empty credentials', () => {
    cy.visit('https://www.saucedemo.com/')

    cy.get('#login-button').click()

    // Assert - 1: Error message should indicate the username is missing
    cy.get('.error-message-container').find('h3').invoke('text').should('contain','Username is required')

  })

  it('Verify the user cannot login without username', () => {
    cy.visit('https://www.saucedemo.com/')
    cy.get('#password').type("secret_sauce")
    cy.get('#login-button').click()

    // Assert - 1: Error message should indicate the username is missing
    cy.get('.error-message-container').find('h3').invoke('text').should('contain','Username is required')
  })

  it('Verify the user cannot login without password', () => {
    cy.visit('https://www.saucedemo.com/')
    cy.get('#user-name').type("standard_user")
    cy.get('#login-button').click()

    // Assert - 1: Error message should indicate the passwordd is missing
    cy.get('.error-message-container').find('h3').invoke('text').should('contain','Password is required')
  })
})


