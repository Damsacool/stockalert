import { supabase } from './supabase';

const DB_NAME = 'StockAlertDB';
const DB_VERSION = 1;
const STORE_NAME = 'products';

class DatabaseManager {
  constructor() {
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      console.log('Opening database...');
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('Database failed to open');
        reject(new Error('Failed to open database'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('Database opened successfully');
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        console.log('Creating/upgrading database...');
        const db = event.target.result;

        // Products store
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const objectStore = db.createObjectStore(STORE_NAME, { 
            keyPath: 'id',
            autoIncrement: false
          });
          objectStore.createIndex('name', 'name', { unique: false });
          objectStore.createIndex('stock', 'stock', { unique: false });
          console.log('Object store created with keyPath: id');
        }

        // Sales transaction store
        if (!db.objectStoreNames.contains('transactions')) {
          const transactionStore = db.createObjectStore('transactions', {
            keyPath: 'id',
            autoIncrement: true
          });
          transactionStore.createIndex('productId', 'productId', { unique: false });
          transactionStore.createIndex('date', 'date', { unique: false});
          transactionStore.createIndex('type', 'type', { unique: false });
          console.log('Transactions store created');
        }
      };
    });
  }

  async addProduct(product) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      console.log('Adding product:', product);
      
      // Validate product has required fields
      if (!product.id) {
        console.error('Product missing ID:', product);
        reject(new Error('Product must have an id field'));
        return;
      }
      
      if (typeof product.id !== 'number') {
        console.error('Product ID is not a number:', typeof product.id, product.id);
        reject(new Error('Product ID must be a number'));
        return;
      }

      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const objectStore = transaction.objectStore(STORE_NAME);
      
      // Create clean product object
      const cleanProduct = {
        id: Number(product.id),
        name: String(product.name || ''),
        stock: Number(product.stock || 0),
        minStock: Number(product.minStock || 0),
        costPrice: Number(product.costPrice || 0),
        sellingPrice: Number(product.sellingPrice || 0),
        images: Array.isArray(product.images) ? product.images : []
      };
      
      console.log('Clean product:', cleanProduct);
      
      const request = objectStore.add(cleanProduct);

      request.onsuccess = async () => {
  console.log('Product added successfully:', cleanProduct.name);
  
  // Sync product to Supabase
  try {
    const { error } = await supabase
        .from('products')
        .insert([{
          id: cleanProduct.id,
          name: cleanProduct.name,
          stock: cleanProduct.stock,
          minStock: cleanProduct.minStock,
          costPrice: cleanProduct.costPrice,
          sellingPrice: cleanProduct.sellingPrice,
          images: cleanProduct.images
          }]);
        
        if (error) {
         console.error('Supabase sync error:', error);
         console.error('Error details:', JSON.stringify(error, null, 2));
        } else {
        console.log('Synced to Supabase successfully!');
     }
        } catch (err) {
        console.error('Supabase error:', err);
        }
  
        resolve(cleanProduct);
      };

      request.onerror = (e) => {
        console.error('Failed to add product:', e.target.error);
        reject(e.target.error);
      };
    });
  }

  async getAllProducts() {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const objectStore = transaction.objectStore(STORE_NAME);
      const request = objectStore.getAll();

      request.onsuccess = () => {
        console.log('Loaded products:', request.result.length);
        resolve(request.result || []);
      };

      request.onerror = () => {
        console.error('Failed to get products');
        reject(new Error('Failed to retrieve products'));
      };
    });
  }

  async updateProduct(product) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const objectStore = transaction.objectStore(STORE_NAME);
      const request = objectStore.put(product);request.onsuccess = async () => {
  console.log('Product updated:', product.name);
  
  // Sync update to Supabase
  try {
    const { error } = await supabase
      .from('products')
      .update({
        name: product.name,
        stock: product.stock,
        minStock: product.minStock,
        costPrice: product.costPrice,
        sellingPrice: product.sellingPrice,
        images: product.images
      })
      .eq('id', product.id);
    
    if (error) console.error('Supabase sync error:', error);
  } catch (err) {
    console.error('Supabase error:', err);
  }
  
  resolve(product);
};

      request.onerror = () => {
        console.error('Failed to update product');
        reject(new Error('Failed to update product'));
      };
    });
  }

  async deleteProduct(productId) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const objectStore = transaction.objectStore(STORE_NAME);
      const request = objectStore.delete(productId);

      request.onsuccess = async () => {
        console.log('Product deleted:', productId);
          //delete from Supabase
      try {
        const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
    
      if (error) {
        console.error('Supabase delete error:', error);
      } else {
       console.log('Deleted from Supabase!');
     }
    } catch (err) {
      console.error('Supabase error:', err);
    }

        resolve(productId);
      };

      request.onerror = () => {
        console.error('Failed to delete product');
        reject(new Error('Failed to delete product'));
      };
    });
  }

  async clearAllProducts() {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const objectStore = transaction.objectStore(STORE_NAME);
      const request = objectStore.clear();

      request.onsuccess = () => {
        console.log('All products cleared');
        resolve();
      };

      request.onerror = () => {
        console.error('Failed to clear products');
        reject(new Error('Failed to clear products'));
      };
    });
  }

  // Transaction methods
async addTransaction(transaction) {
  if (!this.db) await this.init();

  return new Promise((resolve, reject) => {
    const txn = this.db.transaction(['transactions'], 'readwrite');
    const store = txn.objectStore('transactions');
    const request = store.add(transaction);

    request.onsuccess = async () => {
      console.log('Transaction logged');
      
      //sync to Supabase
      try {
        const { error } = await supabase
          .from('transactions')
          .insert([{
            productId: transaction.productId,
            productName: transaction.productName,
            type: transaction.type,
            quantity: transaction.quantity
          }]);
        
        if (error) {
          console.error('Supabase transaction sync error:', error);
        } else {
          console.log('Transaction synced to Supabase!');
        }
      } catch (err) {
        console.error('Supabase error:', err);
      }
      
      resolve(transaction);
    }

    request.onerror = () => {
      console.error('Failed to log transaction');
      reject(new Error('Failed to log transaction'))
    }
  });
}

  async getAllTransactions() {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['transactions'], 'readonly');
      const store = transaction.objectStore('transactions');
      const request = store.getAll();

      request.onsuccess  = () => {
        resolve(request.result || []);
      }

      request.onerror = () => {
        console.error('Failed to get transaction');
        reject(new Error('Failed to get transactions'));
      }
    })
  }

    async getTransactionsByProductId(productId) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['transactions'], 'readonly');
      const store = transaction.objectStore('transactions');
      const index = store.index('productId');
      const request = index.getAll(productId);

      request.onsuccess = () => {
        resolve(request.result || []);
      };

      request.onerror = () => {
        reject(new Error('Failed to get transactions by product ID'));
      }
    });
  }
}

// Data Recovery: Restore from Supabase
export const restoreFromSupabase = async () => {
  try {
    console.log('Starting restore from Supabase...');
    
    // Fetch all products from Supabase
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*');
    
    if (productsError) throw productsError;
    
    // Fetch all transactions from Supabase
    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select('*');
    
    if (transactionsError) throw transactionsError;
    
    //Clear local database
    await dbManager.clearAllProducts();
    
    //Restore products to IndexedDB
    await dbManager.init();
    for (const product of products) {
      await dbManager.addProduct({
        id: product.id,
        name: product.name,
        stock: product.stock,
        minStock: product.minStock,
        costPrice: product.costPrice,
        sellingPrice: product.sellingPrice,
        images: product.images || []
      });
    }
    
    // Restore transactions to IndexedDB
    for (const transaction of transactions) {
      await dbManager.addTransaction({
        productId: transaction.productId,
        productName: transaction.productName,
        type: transaction.type,
        quantity: transaction.quantity,
        date: transaction.date || transaction.created_at
      });
    }
    
    console.log('Restore complete');
    console.log(`Restored ${products.length} products and ${transactions.length} transactions`);
    
    return {
      success: true,
      productsCount: products.length,
      transactionsCount: transactions.length
    };
  } catch (error) {
    console.error('Restore failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

const dbManager = new DatabaseManager();

export const initDB = () => dbManager.init();
export const getAllProducts = () => dbManager.getAllProducts();
export const addProduct = (product) => dbManager.addProduct(product);
export const updateProduct = (product) => dbManager.updateProduct(product);
export const deleteProduct = (productId) => dbManager.deleteProduct(productId);
export const clearAllProducts = () => dbManager.clearAllProducts();
export const addTransaction = (transaction) => dbManager.addTransaction(transaction);
export const getAllTransactions = () => dbManager.getAllTransactions();
export const getTransactionsByProductId = (productId) => dbManager.getTransactionsByProductId(productId);

export default dbManager;
