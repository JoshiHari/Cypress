describe('Ordering Flow', () =>{

    it('Validate that user a add a product in the cart', () =>{
        // Logging in with the correct set of credentials
        cy.visit('https://www.saucedemo.com/')
        cy.get('#user-name').type("standard_user")
        cy.get('#password').type("secret_sauce")
        cy.get('#login-button').click()

        //Grabing the list of product and adding the required product in cart
        cy.get('.inventory_item').each(($product) => {
            let prod_name = "";  
            cy.wrap($product).find('.inventory_item_name').invoke('text').then((text) => {
                prod_name = text
            cy.log(prod_name.includes("Sauce Labs Backpack"))
            if (prod_name == "Sauce Labs Backpack"){
                cy.wrap($product).find('#add-to-cart-sauce-labs-backpack').click()
                return false;
            }
            })

        })

    })
})