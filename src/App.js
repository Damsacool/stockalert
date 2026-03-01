import React, { useState } from 'react';
import { Plus, Package, UserPlus } from 'lucide-react';
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
import {exportToExcel, exportSummaryReport} from './utils/exportToExcel'
import SalesDashboard from './components/Layout/SalesDashboard';
import TransactionHistory from './components/Layout/TransactionHistory'
import SalesChart from './components/Layout/SalesChart';
import TabNavigation from './components/Layout/TabNavigation';
import PrintReports from './components/Layout/PrintReports';
import InstallPrompt from './components/Common/InstallPrompt';
import OfflineIndicator from './components/Common/OfflineIndicator';
import { useNotifications } from './hooks/useNotifications';
import RestoreButton from './components/Common/RestoreButton';
import { processSyncQueue } from './utils/db';
import { useAuth } from './contexts/AuthContext';
import LoginScreen from './components/Auth/LoginScreen';
import AddWorkerModal from './components/Auth/AddWorkerModal';

function App() {
  const { 
    user, 
    profile,
    loading 
  } = useAuth();
  console.log('Profile:', profile);

  const {
    products,
    isLoading,
    addNewProduct,
    updateStock, 
    updateImages,
    removeProduct
  } = useProducts();

  const {
    permission,
    requestPermission,
    sendLowStockAlert
  } = useNotifications();

  // Check for low stock and schedule daily reminders
  React.useEffect(() => {
  const lowstockProducts = products.filter(p => p.stock <= p.minStock);
  
  if (lowstockProducts.length > 0) {
    if ( permission === 'default') {
      requestPermission();
    }
    
    // Schedule daily 6 PM reminder
    const now = new Date();
    const lastReminder = localStorage.getItem('lastLowStockReminder');
    const today = now.toDateString();
    
    // Remind once per day
    if (lastReminder !== today) {
      const reminderTime = new Date();
      reminderTime.setHours(18, 0, 0, 0); 

      // If past 6 PM, schedule for tomorrow
      if (now > reminderTime) {
        reminderTime.setDate(reminderTime.getDate() + 1);
      }
      
      const timeUntilReminder = reminderTime - now;
      
      setTimeout(() => {
        if ( permission === 'granted') {
          sendLowStockAlert(lowstockProducts);
          localStorage.setItem('lastLowStockReminder', new Date().toDateString());
        }
      }, timeUntilReminder);
      
      console.log(`Low stock reminder scheduled for ${reminderTime.toLocaleString()}`);
    }
  }
}, [products, permission, requestPermission, sendLowStockAlert]);

  // Auto-sync queue when back online
React.useEffect(() => {
  const handleOnline = async () => {
    console.log('Back online! Processing sync queue...');
    const result = await processSyncQueue();
    
    if (result.success && result.synced > 0) {
      console.log(`Synced ${result.synced} offline changes!`);
    }
  };

  window.addEventListener('online', handleOnline);

  // Also process queue on app load (in case user closed app while offline)
  if (navigator.onLine) {
    processSyncQueue();
  }

  return () => {
    window.removeEventListener('online', handleOnline);
  };
}, []);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [bulkAmount, setBulkAmount] = useState('');
  const [bulkType, setBulkType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [activeTab, setActiveTab] = useState('inventory');
  const [showAddWorkerModal, setShowAddWorkerModal] = useState(false);

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
   filteredProducts.sort((a, b) => {
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
        return 0;
    }
  });

  if (loading) {
  return <LoadingScreen />;
}

if (!user) {
  return <LoginScreen />;
}

  return (
    <div className='app'>
        <OfflineIndicator />
        <InstallPrompt />
      
      <header className="app-header">
        <div className="header-content">
          <Package size={32} />
          <div>
            <h1>StockAlert</h1>
            <p>Pièces de rechange</p>
          </div>

           {/* Worker button - only for owners */}
      {profile?.role === 'owner' && (
       <button
        onClick={() => setShowAddWorkerModal(true)}
        style={{
          padding: '8px 16px',
          background: '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <UserPlus size={18} />
        Ajouter travailleur
      </button>
    )}

          <RestoreButton onRestoreComplete={() => window.location.reload()} /> 

          {profile?.role === 'owner' && ( 
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
          )}
        </div>
      </header>

      {/* Tab Navigation */}
      <TabNavigation activeTab={activeTab} onChange={setActiveTab} />

      <div className='container'>
        {/* TAB 1: INVENTAIRE */}
        {activeTab === 'inventory' && (
          <>
            <button className='btn-add-product' onClick={() => setShowAddModal(true)}>
              <Plus size={24} />
              <span>Ajouter Nouveau Produit</span>
            </button>

            {products.length > 0 && <AnalyticsSummary products={products} />}

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

            <div className='product-grid'>
              {filteredProducts.length === 0 ? (
                <div className='empty-state'>
                  <Package size={64} strokeWidth={1} />
                  <p>Aucun produit trouvé</p>
                  <p className='empty-subtitle'>
                    {searchQuery ? 'Essayez un autre terme de recherche' : 'Ajoutez votre premier produit ci-dessus'}
                  </p>
                </div>
              ) : (
                filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onStockChange={handleStockChange}
                    onEdit={handleEditImages}
                    onDelete={handleDeleteProduct}
                    userRole={profile?.role}
                  />
                ))
              )}
            </div>
          </>
        )}

        {/* TAB 2: VENTES */}
        {activeTab === 'sales' && (
          <>
            {products.length > 0 ? (
              <>
                <SalesDashboard products={products} />
                <SalesChart products={products} />
              </>
            ) : (
              <div className='empty-state'>
                <Package size={64} strokeWidth={1} />
                <p>Aucun produit</p>
                <p className='empty-subtitle'>Ajoutez des produits dans l'onglet Inventaire</p>
              </div>
            )}
          </>
        )}

        {/* TAB 3: HISTORIQUE */}
        {activeTab === 'history' && (
          <>
            {products.length > 0 ? (
              <TransactionHistory products={products} />
            ) : (
              <div className='empty-state'>
                <Package size={64} strokeWidth={1} />
                <p>Aucun produit</p>
                <p className='empty-subtitle'>Ajoutez des produits dans l'onglet Inventaire</p>
              </div>
            )}
          </>
        )}

        {/* TAB 4: RAPPORTS */}
        {activeTab === 'reports' && (
          <>
            {profile?.role === 'owner' ? (
              products.length > 0 ? (
                <PrintReports
                  products={products}
                  onExport={handleExport}
                  onExportSummary={handleExportSummary}
                />
              ) : (
                <div className='empty-state'>
                  <Package size={64} strokeWidth={1} />
                  <p>Aucun produit</p>
                  <p className='empty-subtitle'>Ajoutez des produits dans l'onglet Inventaire</p>
                </div>
              )
            ) : (
              <div className='empty-state'>
                <Package size={64} strokeWidth={1} />
                <p>Accès restreint</p>
                <p className='empty-subtitle'>Les rapports sont réservés au propriétaire</p>
              </div>
            )}
          </>
        )}

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


      {/* Modals */}
      <AddWorkerModal
        show={showAddWorkerModal}
        onClose={() => setShowAddWorkerModal(false)}
        onWorkerAdded={() => {
          alert('Travailleur ajouté avec succès!');
        }}
      />
    </div>
  );
}

export default App;