describe('Ordering Flow', () =>{
    let initial_price = 0;
    it('Validate that user can add a product in the cart and checkout', () =>{
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
        // Completing the checkout flow
        cy.get('.shopping_cart_link').click()
        cy.get('#checkout').click()
        cy.get("#first-name").type("Storm")
        cy.get("#last-name").type("Stormer")
        cy.get("#postal-code").type("234556")
        cy.get("#continue").click()
        cy.get("#finish").click()
        cy.get("#back-to-products").click()
    })

    it('Validate that the price displayed on all the pages in the checkout flow is the same', () =>{

        // Logging with a valid user
        cy.visit('https://www.saucedemo.com/')
        cy.get('#user-name').type("standard_user")
        cy.get('#password').type("secret_sauce")
        cy.get('#login-button').click()
        

        // Looping through all the available products on the page
        cy.get('.inventory_item').each(($product) => {
            let prod_name = "";
            // Wrapping the individual jQuery element to use the cypress functions like .invoke
            cy.wrap($product).find('.inventory_item_name').invoke('text').then((text) => {
                prod_name = text
            cy.log(prod_name.includes("Sauce Labs Backpack"))
            if (prod_name == "Sauce Labs Backpack"){
                 // Fetching the price of the item and storing it in a variable
                cy.wrap($product).find('.inventory_item_price').invoke('text').then((price) => {
                    initial_price = parseFloat(price.replace("$",""))
                    cy.log(initial_price)
                })
                cy.wrap($product).find('#add-to-cart-sauce-labs-backpack').click()
                return false;
            }
            })
        })

        // Navigating to the carts page
        cy.get('.shopping_cart_link').click()
        // Fetching the price of the product on the cart page
        cy.get("#cart_contents_container").find(".inventory_item_price").invoke('text').then((text) => {
            assert.equal(text.replace("$",""),initial_price,"Items prices are matching on the cart page")
        })
        cy.get('#checkout').click()
        cy.get("#first-name").type("Storm")
        cy.get("#last-name").type("Stormer")
        cy.get("#postal-code").type("234556")
        cy.get("#continue").click()
        
        // Price validation on the checkout page
        cy.get("#checkout_summary_container").find(".inventory_item_price").invoke('text').then((text) => {
            assert.equal(text.replace("$",""),initial_price,"Items prices are matching on the Checkout page")
        })
        cy.get("#finish").click()
        cy.get("#back-to-products").click()

    })

    it('User adds all the products and total price should be correct on all the pages', () =>{
         // Logging in with the correct set of credentials
        cy.visit('https://www.saucedemo.com/')
        cy.get('#user-name').type("standard_user")
        cy.get('#password').type("secret_sauce")
        cy.get('#login-button').click()

        cy.get('.inventory_item').each(($product) => {
            let prod_name = "";
            // Wrapping the individual jQuery element to use the cypress functions like .invoke
            cy.wrap($product).find('.inventory_item_name').invoke('text').then((text) => {
                prod_name = text
            cy.wrap($product).find('.inventory_item_price').invoke('text').then((price) => {
                initial_price += parseFloat(price.replace("$",""))
                cy.log(initial_price)
            })
            cy.wrap($product).find('Button').click()

            })
        })
    })
})