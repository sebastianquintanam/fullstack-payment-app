const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint para "/products"
app.get("/", (req, res) => {
    res.send("Bienvenido al backend. Usa /products para obtener los datos.");
  });
  
app.get("/products", (req, res) => {
    console.log("Request received at /products");
    res.json([
      { id: 1, name: "Product 1", description: "Description for product 1", price: 100 },
      { id: 2, name: "Product 2", description: "Description for product 2", price: 200 },
    ]);
  });  

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});


