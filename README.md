API

all data sent to the server has Content-Type: application/json
baseURL: http://aonlinestore.herokuapp.com/api

Auth

/authme (Used for initial authorization)
  
  Request:
  POST
  Body - empty,
  Headers - {authtoken: "your token"}
  
  Response:
  If user is authorized:
  {
    "code": 0,
    "data": {
        "userId": "user id",
        "userName": "user name",
        "role": "your role"
    }
  }
  If token is wrong:
  {
    "code": 1,
    "message": "You are not authorized"
  }
  If no token passed:
  "Access Denied"

/login (Used for user login with any role)
  
  Request:
  POST
  Body - {email: "user email", password: "user password"}
  
  Response:
  If success:
  {
    "token": "user token",
    "code": 0,
    "message": "Login success",
    "data": {
        "userName": "user name",
        "userId": "user id",
        "role": "user role"
     }
  }
  If wrong credentials:
  {
    "code": 1,
    "message": "You enter wrong login or password"
  }
  
Work with products

/products (Get all products)

  Request:
  GET
  
  Response:
  In response get array of objects
  
/products/details?id=61d50fe2be341bf7a2eb688a (Get one product)

  Request:
  GET
  Query params - id="item id"
  
  Response:
  If id is correct in response get object with details
  If id is incorrect:
  {
    "code": 1,
    "message": "Not found"
  }
  
/products/add (Add new product)

  Request:
  POST
  Body format - 
  {"formData": {
     "title": "Product 5",
      "description": "Lorem Ipsum is simply great text of the printing and typesetting industry.", 
      "category": "Cheap or Super cheap or Expensive",
      "available": "Yes or No",
      "gender": "Male or Female or Unisex",
      "rating": 5 (must be a number),
      "price": "650",
      "image": "https://upload.wikimedia.org/wikipedia/commons/b/b9/Chocolate_Chip_Cookies_-_kimberlykv.jpg (img url)",
      "itemsSold": "23"
    }
 }
 Headers - {authtoken: "your token"}
  
  Response:
  If success:
  {
    "code": 0,
    "message": "Product created"
  }
  If format is incorrect:
  {
    "code": 1,
    "message": "Failed"
  }
  If no authtoken added:
  "Access Denied"
  If authtoken is wrong:
  {
    "code": 1,
    "message": "You are not authorized"
  }
  
/products/update?id=61d50fe2be341bf7a2eb688a (Update existing product)

  Request:
  PUT
  Body format - same as for add new product
  Headers - {authtoken: "your token"}
  Query params - id="item id"
  
  Response:
  If success:
  {
    "code": 0,
    "message": "Product updated"
  }
  If no authtoken added:
  "Access Denied"
  If authtoken is wrong:
  {
    "code": 1,
    "message": "You are not authorized"
  }
  
/products/delete (Delete existing product)

  Request:
  POST
  Body - {id: "product id"}
  Headers - {authtoken: "your token"}
  
  Response:
  If success:
  {
    "code": 0,
    "message": "Item deleted successfully"
  }
  If no authtoken added:
  "Access Denied"
  If authtoken is wrong:
  {
    "code": 1,
    "message": "You are not authorized"
  }
  
/products/search (Search products by title or title and filter applied. Use this method if you search by title name)

  Request:
  POST
  Body - 
  {"config":
    {
        "title": "search value", // if you search by title only then do not include any of the key-value next, just like this: {"config": {"title": "search value"}}
        "available": "Yes or No only", //optional filter
        "category": "Expensive or Cheap or Super cheap only", //optional filter
        "gender": "Unisex or Male or Female only", //optional filter
        "priceTo": "900 or any other number", //optional filter
        "priceFrom": "10 or any other number", //optional filter
        "rating": "5 or any 1 to 5 number" //optional filter
    }
  }
  Please note: you may only include params listed in the object above, but not required to include all of them. The only one required is title, 
  but it may be empty string, so you will get all available products in response.
  
  Response:
  If success: receive array of filtered objects
  
/products/filter (Similar filter to the one above. Used to search products by filter data only without title name.)

  Request:
  POST
  Body - 
  {"formArr":
    {
        "available": "Yes or No only", //optional filter
        "category": "Expensive or Cheap or Super cheap only", //optional filter
        "gender": "Unisex or Male or Female only", //optional filter
        "priceTo": "900 or any other number", //optional filter
        "priceFrom": "10 or any other number", //optional filter
        "rating": "5 or any 1 to 5 number" //optional filter
    }
  }
  Please note: you may only include params listed in the object above, but not required to include all of them.
  
  Response:
  If success: receive array of filtered objects
  
/get-products (Get products including filtered)

  Request:
  POST
  Body - 
  {"config":
    {
        "title": "search value", //optional, if you search by title only then do not include any of the key-value next, just like this: {"config": {"title": "search value"}}
        "available": "Yes or No only", //optional filter
        "category": "Expensive or Cheap or Super cheap only", //optional filter
        "gender": "Unisex or Male or Female only", //optional filter
        "priceTo": "900 or any other number", //optional filter
        "priceFrom": "10 or any other number", //optional filter
        "rating": "5 or any 1 to 5 number" //optional filter
    }
  } // if want to get all products then pass empty config {}
  Query params - page= "page number"
  
  Response:
  {
    data: [Array of maximum of 5 items],
    totalProductsCount: // number of total items found matching request
  }

  /purchase (Buy product)

  Request:
  POST
  Body - {} (empty)
  Headers - {authtoken: "your token"}
  Query params - id="item id"
  
  Response:
  If success:
  {
    "code": 0,
    "message": "Product purchased"
  }
  If product number in stock is 0:
  {
    "code": 1,
    "message": "Product is not available"
  }
  If bad request:
  {
    "code": 1,
    "message": "Error"
  }