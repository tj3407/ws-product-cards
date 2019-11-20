WS Product List App

Demo: http://whosnapit.com/ws-product-cards

NOTES:

    Main Products Page:
    - Products are loaded from metadata/products.json file
    - User will be shown a list of products in card format with image, description, price and 'buy' button
    - Clicking on 'Buy' will add the product in localStorage
    - Clicking on 'Buy' will show a success modal indicating item has been added to cart
    - A checkout link is also shown in the header with a value. Clicking 'Buy' on a particular item will increment this value

    Checkout Page:
    - Products that have been added to cart will be shown in this page
    - User will be shown the list of products with image, description, price and 'remove' button
    - Clicking on 'Remove' will remove the product in localStorage as well as update the checkout value in the header

    Storage Option:
    - User will have an option at the bottom of the Main Products page to choose between localStorage or sessionStorage to store products that are added to cart
    - Whenever a selection is made, items in cart are set to the selected storage option and cleared in the unselected option from the browser storage
        ex: option = localStorage
            current cart items = 4
            localStorage items = 4
            sessionStorage items = 0

            -> select sessionStorage option
            -> set sessionStorage items = localStorage items
            -> remove localStorage items

            current cart items = 4
            localStorage items = 0
            sessionStorage items = 4