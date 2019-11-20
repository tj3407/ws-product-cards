WS Product List App

Demo: http://whosnapit.com/ws-product-cards

NOTES:

    Main Products Page:
    - Products are loaded from metadata/products.json file
    - User will be shown a list of products in card format with image, description, price and 'buy' button
    - Clicking on 'Buy' will add the product in localStorage
    - A checkout link is also shown in the header with a value. Clicking 'Buy' on a particular item will increment this value

    Checkout Page:
    - Products that have been added to cart will be shown in this page
    - User will be shown the list of products with image, description, price and 'remove' button
    - Clicking on 'Remove' will remove the product in localStorage as well as update the checkout value in the header