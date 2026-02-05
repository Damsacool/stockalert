import React, { useState } from 'react';
import { Plus, Package } from 'lucide-react';
import { useProducts } from './hooks/useProducts';
import LoadingScreen from './components/Common/LoadingScreen'
import ProductCard from './components/Product Features/ProductCard';
import AddProductModal from './components/Modals/AddProductModal';
import BulkEditModal from './components/Modals/BulkEditModal';
import ImageEditorModal from './components/Modals/ImageEditorModal';
import './styles/App.css';
import { clearAllProducts } from './utils/db';
import AnalyticsSummary from './components/Layout/AnalyticsSummary'; 
import SearchBar from './components/Common/SearchBar';
import FilterButtons from './components/Common/FilterButtons';
import ExportButton from './components/Common/ExportButton';
import {exportToExcel, exportSummaryReport} from './utils/exportToExcel'
import SalesDashboard from './components/Layout/SalesDashboard';
import SortDropdown from './components/Common/SortDropdown';

function App() {
  const {
    products,
    isLoading,
    addNewProduct,
    updateStock, 
    updateImages,
    removeProduct
  } = useProducts();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [bulkAmount, setBulkAmount] = useState('');
  const [bulkType, setBulkType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const [formData, setFormData] = useState({
    name: '',
    stock: '',
    minStock: '',
    costPrice: '',
    sellingPrice: '',
    images: ['', '', '', '']
  });

  const handleStockChange = (productId, action) => {
    if (action === 'bulk-decrease' || action === 'bulk-increase') {
      setSelectedProduct(products.find(p => p.id === productId));
      setBulkType(action === 'bulk-increase' ? 'increase' : 'decrease');
      setShowBulkModal(true);
    } else {
      updateStock(productId, action);
    }
  };

  const handleBulkSubmit = () => {
    const amount = parseInt(bulkAmount);
    if (!amount || amount <= 0) {
      alert('Entrez un nombre valide');
      return;
    }

    const newStock = bulkType === 'increase' 
      ? selectedProduct.stock + amount 
      : Math.max(0, selectedProduct.stock - amount);

    updateStock(selectedProduct.id, newStock);
    setShowBulkModal(false);
    setBulkAmount('');
  };

  const handleAddProduct = async () => {
    if (!formData.name.trim()) {
      alert('Entrez le nom du produit');
      return;
    }
    if (!formData.stock || parseInt(formData.stock) < 0) {
      alert('Entrez le stock initial');
      return;
    }
    if (!formData.minStock || parseInt(formData.minStock) < 0) {
      alert('Entrez le stock minimum');
      return;
    }

    if (!formData.costPrice || parseInt(formData.costPrice) < 0) {
      alert('Entrez le prix d\'achat');
      return;
    }

    if (!formData.sellingPrice || parseInt(formData.sellingPrice) < 0) {
      alert('Entrez le prix de vente');
      return;
    }
    if (parseInt(formData.sellingPrice) <= parseInt(formData.costPrice)) {
      alert('Le prix de vente doit être supérieur au prix d\'achat!');
      return
    }

    const validImages = formData.images.filter(img => img && img.trim() !== '');

    try {
      const productData = {
        name: formData.name.trim(),
        stock: parseInt(formData.stock, 10),
        minStock: parseInt(formData.minStock, 10),
        costPrice: parseInt(formData.costPrice, 10),
        sellingPrice: parseInt(formData.sellingPrice, 10),
        images: validImages
      };

      await addNewProduct(productData);

      setFormData({
        name: '',
        stock: '',
        minStock: '',
        costPrice: '',
        sellingPrice: '',
        images: ['', '', '', '']
      });
      
      setShowAddModal(false);
      alert('✓ Produit ajouté avec succès!');
    } catch (err) {
      console.error('Error in handleAddProduct:', err);
    }
  };

  const handleImageUpload = (index, file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const newImages = [...formData.images];
      newImages[index] = reader.result;
      setFormData({ ...formData, images: newImages });
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Supprimer ce produit définitivement?')) {
      await removeProduct(productId);
    }
  };

  const handleEditImages = (product) => {
    setSelectedProduct(product);
    setShowImageModal(true);
  };

   if (isLoading) {
    return <LoadingScreen />;
  }

  // Export handlers
  const handleExport = () => {
    try {
      const filename = exportToExcel(products);
      alert(`✓ Exporté: ${filename}`);
    } catch (error) {
      console.error('Export error:', error);
      alert('Erreur lors de l\'export');
    }
  };

  const handleExportSummary = () => {
    try {
      const filename = exportSummaryReport(products);
      alert(`✓ Rapport exporté: ${filename}`);
    } catch (error) {
      console.error('Export error:', error);
      alert('Erreur lors de l\'export du rapport');
    }
  };

  //Filter and search logic
  const filteredProducts = products.filter(product => {
    //Search filter
    const matchesSearch =product.name.toLowerCase().includes(searchQuery.toLowerCase());

    //Stock filter
    let matchesFilter = true;
    if (filterType === 'low-stock') {
      matchesFilter = product.stock <= product.minStock;
    } else if (filterType === 'normal') {
      matchesFilter = product.stock > product.minStock;
    }

    return  matchesSearch && matchesFilter;
  })

  // Sort logic
   .sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
        case 'stock-low':
        return a.stock - b.stock;
        case 'stock-high':
        return b.stock - a.stock;
        case 'date-new':
         return b.id - a.id;
         case 'date-old':
          return a.id - b.id;
      default:
        break;
        return 0;
    }
  });

  if  (isLoading) {

  }

  return (
    <div className='app'>
      <header className="app-header">
        <div className="header-content">
          <Package size={32} />
          <div>
            <h1>StockAlerte</h1>
            <p>Pièces de rechange</p>
          </div>

          <button 
            onClick={async () => {
              if (window.confirm('Reset database?')) {
                await clearAllProducts();
                window.location.reload();
              }
            }}
            style={{ 
              marginLeft: 'auto', 
              padding: '8px 16px', 
              background: '#ef4444', 
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Reset DB
          </button>

          {/* Export Button */}
        {products.length > 0 && (
          <ExportButton 
          onExport={handleExport}
          onExportSummary={handleExportSummary}
          />
        )}

        </div>
      </header>

      <div className='container'>
        <button className='btn-add-product' onClick={() => setShowAddModal(true)}>
          <Plus size={24} />
          <span>Ajouter Nouveau Produit</span>
        </button>


        {/* Analytics Summary */}
        {products.length > 0 && <AnalyticsSummary products={products} />} 

        {/* Sales Dashboard */}
        {products.length > 0 && <SalesDashboard products={products} />}

        {/*Search, Filter & Sort */}
        {products.length > 0 && (
          <>
          <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
          sortBy={sortBy}
          onSortChange={setSortBy}
          />

          <FilterButtons
          activeFilter={filterType}
          onChange={setFilterType}
          counts={{
            all: products.length,
            lowStock: products.filter(p => p.stock <= p.minStock).length,
            normal: products.filter(p => p.stock > p.minStock).length
          }}
          />
          </>
        )}

        

        {/* Product Grid using filtered products */}
        <div className='product-grid'>
          {filteredProducts.length === 0 ? (
            <div className='empty-state'>
              <Package size={64} strokeWidth={1} />
              <p>Aucun produit trouve</p>
              <p className='empty-subtitle'>{searchQuery ? 'Essayez un autre terme de recherche': 'Ajoutez votre premier produit ci-dessus'}</p>
            </div>
          ) : (
            filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onStockChange={handleStockChange}
                onEdit={handleEditImages}
                onDelete={handleDeleteProduct}
              />
            ))
          )}
        </div>
      </div>

      <AddProductModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleAddProduct}
        onImageUpload={handleImageUpload}
      />

      <BulkEditModal
        show={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        product={selectedProduct}
        bulkType={bulkType}
        bulkAmount={bulkAmount}
        setBulkAmount={setBulkAmount}
        onSubmit={handleBulkSubmit}
      />

      <ImageEditorModal
        show={showImageModal}
        onClose={() => setShowImageModal(false)}
        product={selectedProduct}
        setProduct={setSelectedProduct}
        updateImages={updateImages}
      />
    </div>
  );
}

export default App;