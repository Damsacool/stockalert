import { useState, useEffect } from 'react';
import * as db from '../utils/db';


export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize database and load products
  useEffect(() => {
    const initApp = async () => {
      try {
        await db.initDB();
        const loadedProducts = await db.getAllProducts();
        setProducts(loadedProducts || []);
        } catch (err) {
        console.error('Failed to initialize:', err);
        setError(err.message);
        } finally {
        setIsLoading(false);
      }
    };

    initApp();
    }, []);

  // Add new product
  const addNewProduct = async (productData) => {
    try {
      // Create complete product object with ID
      const newProduct = {
        id: Date.now(),
        name: productData.name || '',
        stock: Number(productData.stock) || 0,
        minStock: Number(productData.minStock) || 0,
        costPrice: Number(productData.costPrice) || 0,
        sellingPrice: Number(productData.sellingPrice) || 0,
        images: Array.isArray(productData.images) ? productData.images : []
      };

      console.log('Adding product:', newProduct); // Debug log

      // Add to IndexedDB
      await db.addProduct(newProduct);
      
      // Update state
      setProducts(prev => [newProduct, ...prev]);
      
      return newProduct;
    } catch (err) {
      console.error('Failed to add product:', err);
      alert('Erreur: Impossible d\'ajouter le produit');
      throw err;
    }
  };

  // Update product stock
  const updateStock = async (productId, newStockOrAction) => {
  try {
    const product = products.find(p => p.id === productId);
    if (!product) {
      console.error('Product not found:', productId);
      return;
    }

    let newStock;

    // Handle actions (+1, -1) or direct number
    if (newStockOrAction === 'increment') {
      newStock = product.stock + 1;
    } else if (newStockOrAction === 'decrement') {
      newStock = Math.max(0, product.stock - 1);
    } else {
      newStock = Number(newStockOrAction);
    }

    const oldStock = product.stock;
    const updatedProduct = { 
      ...product, 
      stock: newStock
    };

    await db.updateProduct(updatedProduct);
    setProducts(prev =>
      prev.map(p => (p.id === productId ? updatedProduct : p))
    );

    // Log transaction if stock decreased (sale)
    if (newStock < oldStock) {
      const transaction = {
        id: Date.now(),
        productId: productId,
        productName: product.name,
        type: 'Sale',
        quantity: oldStock - newStock,
        date: new Date().toISOString()
      };

      await db.addTransaction(transaction);
      console.log('Sale logged:', transaction);
    }
  } catch (err) {
    console.error('Failed to update stock:', err);
    alert('Erreur: Impossible de mettre à jour le stock');
  }
};

  // Update product images
  const updateImages = async (productId, images) => {
    try {
      const product = products.find(p => p.id === productId);
      if (!product) {
        console.error('Product not found:', productId);
        return;
      }

      const updatedProduct = { 
        ...product, 
        images: Array.isArray(images) ? images : [] 
      };
      
      await db.updateProduct(updatedProduct);
      setProducts(prev =>
        prev.map(p => (p.id === productId ? updatedProduct : p))
      );
    } catch (err) {
      console.error('Failed to update images:', err);
      alert('Erreur: Impossible de mettre à jour les images');
      throw err;
    }
  };

  // Delete product
  const removeProduct = async (productId) => {
    try {
      await db.deleteProduct(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (err) {
      console.error('Failed to delete product:', err);
      alert('Erreur: Impossible de supprimer le produit');
      throw err;
    }
  };

  return {
    products,
    isLoading,
    error,
    addNewProduct,
    updateStock,
    updateImages,
    removeProduct
  };
};