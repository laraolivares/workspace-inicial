const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { promisify } = require('util');

// Initialize express app
const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());  // Enable CORS for all routes

// Promisify fs methods
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const readdirAsync = promisify(fs.readdir);

// Helper function to get file path for each resource
const getFilePath = (fileName) => path.join(__dirname, 'emercado-api-main', fileName);

// Helper function to read JSON file
const readJSONFile = async (filePath) => {
    try {
        const data = await readFileAsync(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error);
        throw error;  // Re-throw the error to handle it in the route
    }
};

// Helper function to write JSON data to a file
const writeJSONFile = async (filePath, data) => {
    try {
        await writeFileAsync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error(`Error writing file ${filePath}:`, error);
        throw error;  // Re-throw the error to handle it in the route
    }
};

// Routes for wcInicial (cart/buy.json)
app.get('/cart', async (req, res) => {
    try {
        const filePath = getFilePath('cart/buy.json');
        const data = await readJSONFile(filePath);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error reading wcInicial' });
    }
});

app.post('/cart', async (req, res) => {
    try {
        const filePath = getFilePath('cart/buy.json');
        const data = await readJSONFile(filePath);
        data.push(req.body);  // Add new item to the data
        await writeJSONFile(filePath, data);
        res.status(201).json(req.body);
    } catch (error) {
        res.status(500).json({ message: 'Error creating wcInicial data' });
    }
});

app.put('/cart/:id', async (req, res) => {
    try {
        const filePath = getFilePath('cart/buy.json');
        const data = await readJSONFile(filePath);
        const index = data.findIndex(item => item.id === parseInt(req.params.id));
        if (index === -1) {
            return res.status(404).json({ message: 'Item not found' });
        }
        data[index] = { ...data[index], ...req.body };
        await writeJSONFile(filePath, data);
        res.json(data[index]);
    } catch (error) {
        res.status(500).json({ message: 'Error updating wcInicial data' });
    }
});

app.delete('/cart/:id', async (req, res) => {
    try {
        const filePath = getFilePath('cart/buy.json');
        const data = await readJSONFile(filePath);
        const index = data.findIndex(item => item.id === parseInt(req.params.id));
        if (index === -1) {
            return res.status(404).json({ message: 'Item not found' });
        }
        data.splice(index, 1);  // Remove item from the data
        await writeJSONFile(filePath, data);
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting wcInicial data' });
    }
});

// Routes for cats (cats/cat.json)
app.get('/cats', async (req, res) => {
    try {
        const filePath = getFilePath('cats/cat.json');
        const data = await readJSONFile(filePath);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error reading cats data' });
    }
});

app.post('/cats', async (req, res) => {
    try {
        const filePath = getFilePath('cats/cat.json');
        const data = await readJSONFile(filePath);
        data.push(req.body);  // Add new category
        await writeJSONFile(filePath, data);
        res.status(201).json(req.body);
    } catch (error) {
        res.status(500).json({ message: 'Error creating category' });
    }
});

app.put('/cats/:id', async (req, res) => {
    try {
        const filePath = getFilePath('cats/cat.json');
        const data = await readJSONFile(filePath);
        const index = data.findIndex(item => item.id === parseInt(req.params.id));
        if (index === -1) {
            return res.status(404).json({ message: 'Category not found' });
        }
        data[index] = { ...data[index], ...req.body };
        await writeJSONFile(filePath, data);
        res.json(data[index]);
    } catch (error) {
        res.status(500).json({ message: 'Error updating category' });
    }
});

app.delete('/cats/:id', async (req, res) => {
    try {
        const filePath = getFilePath('cats/cat.json');
        const data = await readJSONFile(filePath);
        const index = data.findIndex(item => item.id === parseInt(req.params.id));
        if (index === -1) {
            return res.status(404).json({ message: 'Category not found' });
        }
        data.splice(index, 1);  // Remove category
        await writeJSONFile(filePath, data);
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category' });
    }
});

// Routes for sell (sell/publish.json)
app.get('/sell/publish', async (req, res) => {
    try {
        const filePath = getFilePath('sell/publish.json');
        const data = await readJSONFile(filePath);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error reading publish data' });
    }
});

app.post('/sell/publish', async (req, res) => {
    try {
        const filePath = getFilePath('sell/publish.json');
        const data = await readJSONFile(filePath);
        data.push(req.body);  // Add new product
        await writeJSONFile(filePath, data);
        res.status(201).json(req.body);
    } catch (error) {
        res.status(500).json({ message: 'Error creating publish data' });
    }
});

// Routes for user_cart (user_cart/:id.json)
app.get('/user_cart/:id', async (req, res) => {
    try {
        const filePath = getFilePath(`user_cart/${req.params.id}.json`);
        const data = await readJSONFile(filePath);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error reading user cart' });
    }
});

app.put('/user_cart/:id', async (req, res) => {
    try {
        const filePath = getFilePath(`user_cart/${req.params.id}.json`);
        const data = await readJSONFile(filePath);
        data.items = req.body.items;  // Update the items
        await writeJSONFile(filePath, data);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user cart' });
    }
});

// Routes for products_comments (combine all files in /products_comments folder)
app.get('/products_comments', async (req, res) => {
    try {
        const directoryPath = getFilePath('products_comments');
        const files = await readdirAsync(directoryPath);

        const allComments = [];
        for (const file of files) {
            const filePath = path.join(directoryPath, file);
            const data = await readJSONFile(filePath);
            allComments.push(data);
        }

        res.json(allComments);
    } catch (error) {
        console.error('Error reading product comments:', error);
        res.status(500).json({ message: 'Error fetching product comments' });
    }
});

// Routes for products (combine all files in /products folder)
app.get('/products', async (req, res) => {
    try {
        const directoryPath = getFilePath('products');
        const files = await readdirAsync(directoryPath);

        const allProducts = [];
        for (const file of files) {
            const filePath = path.join(directoryPath, file);
            const data = await readJSONFile(filePath);
            allProducts.push(data);
        }

        res.json(allProducts);
    } catch (error) {
        console.error('Error reading products:', error);
        res.status(500).json({ message: 'Error fetching products' });
    }
});

// Routes for cats_products (combine all files in /cats_products folder)
app.get('/cats_products', async (req, res) => {
    try {
        const directoryPath = getFilePath('cats_products');
        const files = await readdirAsync(directoryPath);

        const allProducts = [];
        for (const file of files) {
            const filePath = path.join(directoryPath, file);
            const data = await readJSONFile(filePath);
            allProducts.push(data);
        }

        res.json(allProducts);
    } catch (error) {
        console.error('Error reading cats_products:', error);
        res.status(500).json({ message: 'Error fetching cats products' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
