const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { promisify } = require('util');

const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const readdirAsync = promisify(fs.readdir);

// funcion para encontrar el path 
const getFilePath = (fileName) => path.join(__dirname, 'emercado-api-main', fileName);

const readJSONFile = async (filePath) => {
    try {
        const data = await readFileAsync(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error);
        throw error;  
    }
};

const writeJSONFile = async (filePath, data) => {
    try {
        await writeFileAsync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error(`Error writing file ${filePath}:`, error);
        throw error;  
    }
};


//COMIENZO CATS
// 1. GET todas las categorías
app.get('/cats', async (req, res) => {
    try {
        const filePath = getFilePath('cats/cat.json'); // El archivo contiene un solo JSON con todas las categorías
        const categories = await readJSONFile(filePath);
        res.json(categories);
    } catch (error) {
        console.error('Error leyendo categorías:', error);
        res.status(500).json({ message: 'Error al obtener las categorías' });
    }
});

// 2. GET una categoría específica por ID
app.get('/cats/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const filePath = getFilePath('cats/cat.json');
        const categories = await readJSONFile(filePath);
        
        // Buscar la categoría por ID
        const category = categories.find(c => c.id === parseInt(id));
        
        if (!category) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        res.json(category);
    } catch (error) {
        console.error('Error obteniendo categoría:', error);
        res.status(500).json({ message: 'Error al obtener la categoría' });
    }
});

// 3. POST nueva categoría
app.post('/cats', async (req, res) => {
    try {
        const newCategory = req.body; // Espera un JSON con id, name, description, productCount, imgSrc

        const { id, name, description, productCount, imgSrc } = newCategory;

        if (!id || !name || !description || !productCount || !imgSrc) {
            return res.status(400).json({ message: 'Faltan campos requeridos (id, name, description, productCount, imgSrc)' });
        }

        const filePath = getFilePath('cats/cat.json');
        const categories = await readJSONFile(filePath);

        // Verifica si la categoría ya existe
        if (categories.find(c => c.id === id)) {
            return res.status(400).json({ message: 'La categoría con este ID ya existe' });
        }

        // Agrega la nueva categoría al array
        categories.push(newCategory);

        // Escribe las categorías actualizadas en el archivo
        await writeFileAsync(filePath, JSON.stringify(categories, null, 2));
        res.status(201).json(newCategory); // Devuelve la categoría creada
    } catch (error) {
        console.error('Error agregando categoría:', error);
        res.status(500).json({ message: 'Error al agregar la categoría' });
    }
});

// 4. PUT actualizar una categoría por id
app.put('/cats/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCategory = req.body; // Espera un JSON con campos a actualizar

        const { name, description, productCount, imgSrc } = updatedCategory;

        if (!name && !description && !productCount && !imgSrc) {
            return res.status(400).json({ message: 'Se requiere al menos un campo para actualizar (name, description, productCount, imgSrc)' });
        }

        const filePath = getFilePath('cats/cat.json');
        const categories = await readJSONFile(filePath);

        // Buscar la categoría por ID
        const categoryIndex = categories.findIndex(c => c.id === parseInt(id));

        if (categoryIndex === -1) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        // Actualiza los campos de la categoría
        const categoryToUpdate = categories[categoryIndex];

        if (name) categoryToUpdate.name = name;
        if (description) categoryToUpdate.description = description;
        if (productCount) categoryToUpdate.productCount = productCount;
        if (imgSrc) categoryToUpdate.imgSrc = imgSrc;

        // Escribe las categorías actualizadas en el archivo
        await writeFileAsync(filePath, JSON.stringify(categories, null, 2));
        res.json(categoryToUpdate);
    } catch (error) {
        console.error('Error actualizando categoría:', error);
        res.status(500).json({ message: 'Error al actualizar la categoría' });
    }
});

// 5. DELETE eliminar una categoría por id
app.delete('/cats/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const filePath = getFilePath('cats/cat.json');
        const categories = await readJSONFile(filePath);

        // Buscar el índice de la categoría por ID
        const categoryIndex = categories.findIndex(c => c.id === parseInt(id));

        if (categoryIndex === -1) {
            console.log(`Categoría con id ${id} no encontrada.`);
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        // Elimina la categoría del array
        categories.splice(categoryIndex, 1);

        // Escribe las categorías actualizadas en el archivo
        await writeFileAsync(filePath, JSON.stringify(categories, null, 2));

        console.log(`Categoría con id ${id} eliminada exitosamente.`);
        
        // Respuesta con mensaje de éxito
        res.status(200).json({ message: 'Categoría eliminada con éxito' });
    } catch (error) {
        console.error('Error eliminando categoría:', error);
        res.status(500).json({ message: 'Error al eliminar la categoría' });
    }
});
//FIN CATS

//COMMENTS

//1-Para todos los comentarios que hay
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

// 2. GET de un comentario de un producto especifico
app.get('/products_comments/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const filePath = path.join(getFilePath('products_comments'), `${id}.json`);
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        const comment = await readJSONFile(filePath);
        res.json(comment);
    } catch (error) {
        console.error('Error fetching comment:', error);
        res.status(500).json({ message: 'Error fetching the comment' });
    }
});

// 3. POST nuevo comentario en el producto deseado
app.post('/products_comments/:id', async (req, res) => {
    try {
        const { id } = req.params; // El ID del producto (viene del path de la URL)
        const newComment = req.body; // El comentario nuevo que viene en el cuerpo de la solicitud

        // Desestructuración de los campos requeridos en el comentario
        const { score, description, user, dateTime } = newComment;

        // Validar que todos los campos estén presentes
        if (!score || !description || !user || !dateTime) {
            return res.status(400).json({
                message: 'Missing required fields (score, description, user, dateTime)',
            });
        }

        // El valor de 'product' se establece automáticamente con el ID que viene en la URL
        const commentWithProduct = {
            product: parseInt(id),  // El product se asigna automáticamente con el ID del path
            score,
            description,
            user,
            dateTime,
        };

        // Definir la ruta al archivo de comentarios del producto
        const commentsDir = path.join(__dirname, 'products_comments');
        const productFilePath = path.join(commentsDir, `${id}.json`);

        // Verificar si el archivo de comentarios para el producto ya existe
        let productComments = [];
        if (fs.existsSync(productFilePath)) {
            // Si el archivo existe, leerlo y agregar el nuevo comentario
            productComments = await readJSONFile(productFilePath);
        } else {
            // Si el archivo no existe, simplemente creamos uno vacío
            console.log(`Archivo para el producto ${id} no existe, creando archivo.`);
        }

        // Agregar el nuevo comentario a la lista de comentarios
        productComments.push(commentWithProduct);

        // Escribir los comentarios actualizados en el archivo
        await writeFileAsync(productFilePath, JSON.stringify(productComments, null, 2));

        // Responder con el nuevo comentario agregado
        res.status(201).json(commentWithProduct);

    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Error adding the comment', error: error.message });
    }
});
//FIN COMENTARIOS

//CAT PRODUCTS

// 1. GET todas las categorías
app.get('/cats_products', async (req, res) => {
    try {
        const directoryPath = getFilePath('cats_products');
        const files = await readdirAsync(directoryPath);

        const allCategories = [];
        for (const file of files) {
            const filePath = path.join(directoryPath, file);
            const data = await readJSONFile(filePath);
            allCategories.push(data);
        }

        res.json(allCategories);
    } catch (error) {
        console.error('Error leyendo categorías de productos:', error);
        res.status(500).json({ message: 'Error al obtener las categorías de productos' });
    }
});

// 2. GET una categoría específica por ID (catID)
app.get('/cats_products/:catID', async (req, res) => {
    try {
        const { catID } = req.params;
        const filePath = path.join(getFilePath('cats_products'), `${catID}.json`);
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        const category = await readJSONFile(filePath);
        res.json(category);
    } catch (error) {
        console.error('Error obteniendo categoría:', error);
        res.status(500).json({ message: 'Error al obtener la categoría' });
    }
});

// 3 Ruta para agregar un nuevo producto a una categoría

app.post('/cats_products/:catID', async (req, res) => {
    try {
        const { catID } = req.params;
        const newProduct = req.body;

        // Validación básica de los campos requeridos
        if (!newProduct.id || !newProduct.name || !newProduct.description || !newProduct.cost || !newProduct.currency || !newProduct.soldCount || !newProduct.image) {
            return res.status(400).json({ message: 'Faltan datos del producto.' });
        }

        const filePath = path.join(getFilePath('cats_products'), `${catID}.json`);
        
        // Verificación de la ruta del archivo
        console.log('File path:', filePath);  // Imprimir la ruta del archivo

        // Verificar si el archivo de la categoría existe
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        // Leer los datos actuales de la categoría
        const category = await readJSONFile(filePath);

        // Agregar el nuevo producto al arreglo de productos
        category.products.push(newProduct);

        // Escribir los datos actualizados al archivo
        await writeJSONFile(filePath, category);

        // Responder con el producto agregado y la lista actualizada
        res.status(201).json({
            message: 'Producto agregado exitosamente.',
            products: category.products
        });
    } catch (error) {
        console.error('Error al agregar el producto:', error);
        res.status(500).json({ message: 'Error al agregar el producto' });
    }
});
//4 Ruta para actualizar un producto dentro de una categoría
app.put('/user_cart/:userID/articles/:articleID', async (req, res) => {
    try {
        const { userID, articleID } = req.params;
        const updatedArticle = req.body;

        // Validación básica de los campos requeridos
        if (!updatedArticle.id || !updatedArticle.name || !updatedArticle.count || !updatedArticle.unitCost || !updatedArticle.currency || !updatedArticle.image) {
            return res.status(400).json({ message: 'Faltan datos del artículo.' });
        }

        const filePath = path.join(getFilePath('user_cart'), `${userID}.json`);

        // Verificación de la ruta del archivo
        console.log('File path:', filePath);  // Imprimir la ruta del archivo

        // Verificar si el archivo del carrito de usuario existe
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'Carrito de usuario no encontrado' });
        }

        // Leer los datos actuales del carrito de usuario
        const userCart = await readJSONFile(filePath);

        // Buscar el artículo a actualizar dentro de los artículos del carrito
        const articleIndex = userCart.articles.findIndex(article => article.id === parseInt(articleID));

        if (articleIndex === -1) {
            return res.status(404).json({ message: 'Artículo no encontrado en el carrito' });
        }

        // Actualizar los datos del artículo
        userCart.articles[articleIndex] = { ...userCart.articles[articleIndex], ...updatedArticle };

        // Escribir los datos actualizados al archivo
        await writeJSONFile(filePath, userCart);

        // Responder con el artículo actualizado y el carrito actualizado
        res.status(200).json({
            message: 'Artículo actualizado exitosamente en el carrito.',
            article: userCart.articles[articleIndex]
        });
    } catch (error) {
        console.error('Error al actualizar el artículo:', error);
        res.status(500).json({ message: 'Error al actualizar el artículo en el carrito' });
    }
});

//5 Ruta para eliminar un producto dentro de una categoría
app.delete('/user_cart/:userID/articles/:articleID', async (req, res) => {
    try {
        const { userID, articleID } = req.params;

        const filePath = path.join(getFilePath('user_cart'), `${userID}.json`);

        // Verificación de la ruta del archivo
        console.log('File path:', filePath);  // Imprimir la ruta del archivo

        // Verificar si el archivo del carrito de usuario existe
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'Carrito de usuario no encontrado' });
        }

        // Leer los datos actuales del carrito de usuario
        const userCart = await readJSONFile(filePath);

        // Buscar el artículo a eliminar dentro de los artículos del carrito
        const articleIndex = userCart.articles.findIndex(article => article.id === parseInt(articleID));

        if (articleIndex === -1) {
            return res.status(404).json({ message: 'Artículo no encontrado en el carrito' });
        }

        // Eliminar el artículo del carrito
        userCart.articles.splice(articleIndex, 1);

        // Escribir los datos actualizados al archivo
        await writeJSONFile(filePath, userCart);

        // Responder con un mensaje indicando que el artículo ha sido eliminado
        res.status(200).json({
            message: 'Artículo eliminado exitosamente del carrito.'
        });
    } catch (error) {
        console.error('Error al eliminar el artículo:', error);
        res.status(500).json({ message: 'Error al eliminar el artículo del carrito' });
    }
});
// FIN CATS PRODUCTS

//COMIENZO PRODUCTS
// 1. GET todos los productos
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
        console.error('Error leyendo productos:', error);
        res.status(500).json({ message: 'Error al obtener los productos' });
    }
});

// 2. GET un producto específico por ID
app.get('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const filePath = path.join(getFilePath('products'), `${id}.json`);
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        const product = await readJSONFile(filePath);
        res.json(product);
    } catch (error) {
        console.error('Error obteniendo producto:', error);
        res.status(500).json({ message: 'Error al obtener el producto' });
    }
});

// 3. POST nuevo producto
app.post('/products', async (req, res) => {
    try {
        const newProduct = req.body; // Espera un JSON con id, name, description, cost, currency, soldCount, category, images, relatedProducts

        const { id, name, description, cost, currency, soldCount, category, images, relatedProducts } = newProduct;

        // Validación básica de los campos requeridos
        if (!id || !name || !description || !cost || !currency || !soldCount || !category || !images || !relatedProducts) {
            return res.status(400).json({ message: 'Faltan campos requeridos (id, name, description, cost, currency, soldCount, category, images, relatedProducts)' });
        }

        // Ruta completa donde se almacenarán los productos
        const productsFolderPath = getFilePath('products');
        
        // Verifica si la carpeta 'products' existe, si no, la crea
        if (!fs.existsSync(productsFolderPath)) {
            fs.mkdirSync(productsFolderPath);
        }

        // Define la ruta del archivo con el ID del producto
        const filePath = path.join(productsFolderPath, `${id}.json`);
        
        // Verifica si el archivo del producto ya existe
        if (fs.existsSync(filePath)) {
            return res.status(400).json({ message: 'El producto con este ID ya existe' });
        }

        // Escribe el nuevo producto en un archivo JSON
        await writeFileAsync(filePath, JSON.stringify(newProduct, null, 2));

        // Devuelve una respuesta con el producto creado
        res.status(201).json(newProduct); // El producto creado

    } catch (error) {
        console.error('Error agregando producto:', error);
        res.status(500).json({ message: 'Error al agregar el producto' });
    }
});

// 4. PUT actualizar un producto por id
app.put('/products/:id', async (req, res) => {
    try {
        const { id } = req.params; // El id del producto a actualizar
        const updatedProduct = req.body; // Los datos del producto que queremos actualizar

        const { name, description, cost, currency, soldCount, category, images, relatedProducts } = updatedProduct;

        // Validación básica de los campos requeridos
        if (!name || !description || !cost || !currency || !soldCount || !category || !images || !relatedProducts) {
            return res.status(400).json({ message: 'Faltan campos requeridos (name, description, cost, currency, soldCount, category, images, relatedProducts)' });
        }

        // Ruta completa donde se almacenan los productos
        const productsFolderPath = getFilePath('products');

        // Ruta del archivo que queremos actualizar
        const filePath = path.join(productsFolderPath, `${id}.json`);

        // Verifica si el archivo del producto existe
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Lee el archivo JSON del producto existente
        const existingProduct = await readJSONFile(filePath);

        // Actualiza el producto con los nuevos datos
        const updatedProductData = { ...existingProduct, ...updatedProduct };

        // Escribe los datos actualizados al archivo JSON
        await writeFileAsync(filePath, JSON.stringify(updatedProductData, null, 2));

        // Responde con el producto actualizado
        res.status(200).json({
            message: 'Producto actualizado exitosamente.',
            product: updatedProductData
        });

    } catch (error) {
        console.error('Error actualizando el producto:', error);
        res.status(500).json({ message: 'Error al actualizar el producto' });
    }
});

// 5. DELETE eliminar un producto por id
app.delete('/products/:id', async (req, res) => {
    try {
        const { id } = req.params; // El ID del producto que deseas eliminar

        // Ruta donde se almacenan los productos
        const productsFolderPath = getFilePath('products');

        // Ruta completa del archivo del producto a eliminar
        const filePath = path.join(productsFolderPath, `${id}.json`);

        // Verificar si el archivo del producto existe
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Eliminar el archivo del producto
        await fs.promises.unlink(filePath);

        // Responder indicando que el producto fue eliminado
        res.status(200).json({ message: 'Producto eliminado exitosamente' });

    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ message: 'Error al eliminar el producto' });
    }
});
//FINAL PRODUCTS

//COMIENZO USER CART

// 1. GET obtener el carrito de un usuario específico
app.get('/user_cart/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const filePath = path.join(getFilePath('user_cart'), `${userId}.json`);
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        const cart = await readJSONFile(filePath);
        res.json(cart);
    } catch (error) {
        console.error('Error obteniendo carrito:', error);
        res.status(500).json({ message: 'Error al obtener el carrito' });
    }
});

// 2. POST agregar artículos al carrito de un usuario
app.post('/user_cart/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const newArticle = req.body; // Espera un JSON con id, name, count, unitCost, currency, image

        const { id, name, count, unitCost, currency, image } = newArticle;

        if (!id || !name || !count || !unitCost || !currency || !image) {
            return res.status(400).json({ message: 'Faltan campos requeridos (id, name, count, unitCost, currency, image)' });
        }

        const filePath = path.join(getFilePath('user_cart'), `${userId}.json`);

        let cart = [];
        if (fs.existsSync(filePath)) {
            cart = await readJSONFile(filePath);
        } else {
            cart = { user: parseInt(userId), articles: [] }; // Si no existe el carrito, lo creamos
        }

        // Verificar si el artículo ya está en el carrito
        const existingArticle = cart.articles.find(a => a.id === id);
        if (existingArticle) {
            // Si ya existe, aumentamos la cantidad
            existingArticle.count += count;
        } else {
            // Si no existe, lo agregamos
            cart.articles.push({ id, name, count, unitCost, currency, image });
        }

        // Escribir el carrito actualizado
        await writeFileAsync(filePath, JSON.stringify(cart, null, 2));
        res.status(201).json(cart); // Devolvemos el carrito actualizado
    } catch (error) {
        console.error('Error agregando artículo al carrito:', error);
        res.status(500).json({ message: 'Error al agregar artículo al carrito' });
    }
});

// 3. PUT actualizar artículos en el carrito de un usuario


// 4. DELETE eliminar un artículo del carrito de un usuario

//FINAL USER CART

// Start the server
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
