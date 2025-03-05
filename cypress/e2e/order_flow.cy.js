import { enterUserDetails } from "../support/helpers";

describe("Ordering Flow", () => {
  let cout = 0;
  beforeEach(() => {
    cy.visit("https://www.saucedemo.com/");
    cy.get("#user-name").type("standard_user");
    cy.get("#password").type("secret_sauce");
    cy.get("#login-button").click();
    cy.log("BeforeEach Hook is executed");
  });
  let initial_price = 0;
  it("Validate that user can add a product in the cart and checkout", () => {
    //Grabing the list of product and adding the required product in cart
    cy.get(".inventory_item").each(($product) => {
      let prod_name = "";
      cy.wrap($product)
        .find(".inventory_item_name")
        .invoke("text")
        .then((text) => {
          prod_name = text;
          cy.log(prod_name.includes("Sauce Labs Backpack"));
          if (prod_name == "Sauce Labs Backpack") {
            cy.wrap($product).find("#add-to-cart-sauce-labs-backpack").click();
            return false;
          }
        });
    });
    // Completing the checkout flow
    cy.get(".shopping_cart_link").click();
    cy.get("#checkout").click();
    enterUserDetails();
    cy.get("#continue").click();
    cy.get("#finish").click();
    cy.get("#back-to-products").click();
  });

  it("Validate that the price displayed on all the pages in the checkout flow is the same", () => {
    // Looping through all the available products on the page
    cy.get(".inventory_item").each(($product) => {
      let prod_name = "";
      // Wrapping the individual jQuery element to use the cypress functions like .invoke
      cy.wrap($product)
        .find(".inventory_item_name")
        .invoke("text")
        .then((text) => {
          prod_name = text;
          cy.log(prod_name.includes("Sauce Labs Backpack"));
          if (prod_name == "Sauce Labs Backpack") {
            // Fetching the price of the item and storing it in a variable
            cy.wrap($product)
              .find(".inventory_item_price")
              .invoke("text")
              .then((price) => {
                initial_price = parseFloat(price.replace("$", ""));
                cy.log(initial_price);
              });
            cy.wrap($product).find("#add-to-cart-sauce-labs-backpack").click();
            
        
          }
        });
    });

    // Navigating to the carts page
    cy.get(".shopping_cart_link").click();
    // Fetching the price of the product on the cart page
    cy.get("#cart_contents_container")
      .find(".inventory_item_price")
      .invoke("text")
      .then((text) => {
        assert.equal(
          text.replace("$", ""),
          initial_price,
          "Items prices are matching on the cart page"
        );
      });
    cy.get("#checkout").click();
    enterUserDetails();
    cy.get("#continue").click();

    // Price validation on the checkout page
    cy.get("#checkout_summary_container")
      .find(".inventory_item_price")
      .invoke("text")
      .then((text) => {
        assert.equal(
          text.replace("$", ""),
          initial_price,
          "Items prices are matching on the Checkout page"
        );
      });
    cy.get("#finish").click();
    cy.get("#back-to-products").click();
  });

  it("User adds all the products and total price should be correct on all the pages", () => {
    initial_price = 0;
    // running the .each method to loop through all the results of cy.get('.inventory_item')
    cy.get(".inventory_item").each(($product) => {
      let prod_name = "";
      // Wrapping the individual jQuery element to use the cypress functions like .invoke
      cy.wrap($product)
        .find(".inventory_item_name")
        .invoke("text")
        .then((text) => {
          prod_name = text;
          // Using the same logic to get the individual item price as well
          cy.wrap($product)
            .find(".inventory_item_price")
            .invoke("text")
            .then((price) => {
              initial_price += parseFloat(price.replace("$", ""));
              cy.log(initial_price);
            });
          // Adding all the available products on the page
          cy.wrap($product).find("Button").click();
          cy.screenshot(`Product_Added ${cout}`)
          cout++
        });
    });
    cy.get(".shopping_cart_link").click();
    cy.get("#checkout").click();
    enterUserDetails();
    cy.get("#continue").click();

    let tot_price = 0;

    // Total price validation on the checkout page
    cy.get(".summary_subtotal_label")
      .invoke("text")
      .then((price) => {
        tot_price = parseFloat(price.match(/\d*\.?\d+/g));
        assert.equal(
          tot_price,
          initial_price,
          "Total Price are matching at the checkout page"
        );
      });
  });

  it("Simple map implementation to track the price of each product", () => {
    // Logging in with the correct set of credentials
    initial_price = 0;
    const priceMap = new Map();

    // running the .each method to loop through all the results of cy.get('.inventory_item')
    cy.get(".inventory_item").each(($product) => {
      let prod_name = "";
      // Wrapping the individual jQuery element to use the cypress functions like .invoke
      cy.wrap($product)
        .find(".inventory_item_name")
        .invoke("text")
        .then((text) => {
          prod_name = text;

          // Using the same logic to get the individual item price as well
          cy.wrap($product)
            .find(".inventory_item_price")
            .invoke("text")
            .then((price) => {
              initial_price += parseFloat(price.replace("$", ""));
              priceMap.set(text, price);
              cy.log(initial_price);
            });
          // Adding all the available products on the page
          cy.wrap($product).find("Button").click();
        });
    });
    cy.get(".shopping_cart_link").click();

    // Validation of price and name for all the product in the cart
    cy.get(".cart_item_label").each(($product) => {
      let prod_name = "";
      // Wrapping the individual jQuery element to use the cypress functions like .invoke
      cy.wrap($product)
        .find(".inventory_item_name")
        .invoke("text")
        .then((text) => {
          prod_name = text;

          // Using the same logic to get the individual item price as well
          cy.wrap($product)
            .find(".inventory_item_price")
            .invoke("text")
            .then((price) => {
              // Comparing the names of the product present in the cart with the actual product name at the home pade and price
              if (
                priceMap.has(prod_name) &&
                priceMap.get(prod_name) === price
              ) {
                cy.log(
                  `Product: ${prod_name} is present in the cart with the price: ${price}`
                );
                cy.screenshot(`Price_Validated ${cout}`)
               cout++
              }
            });
        });
    });
    cy.get("#checkout").click();
    enterUserDetails();
    cy.get("#continue").click();

    let tot_price = 0;

    // Total price validation on the checkout page
    cy.get(".summary_subtotal_label")
      .invoke("text")
      .then((price) => {
        tot_price = parseFloat(price.match(/\d*\.?\d+/g));
        assert.equal(
          tot_price,
          initial_price,
          "Total Price are matching at the checkout page"
        );
      });
  });
});
