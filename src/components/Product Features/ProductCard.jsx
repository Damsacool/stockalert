import React, { useState } from 'react';
import { Camera, Trash2, AlertTriangle, Package} from 'lucide-react';

const ProductCard = ({ product, onStockChange, onEdit, onDelete}) => {
    const [showImageZoom, setShowImageZoom] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const isLowStock = product.stock <= product.minStock;
    const hasImages = product.images && product.images.length > 0;

    const handleQuickDecrease = () => {
        if (product.stock > 0) {
            onStockChange(product.id, product.stock - 1);
        }
    };

    const handleQuickIncrease = () => {
        onStockChange(product.id, product.stock + 1);
    };

    const openImageZoom = (index) => {
        setCurrentImageIndex(index);
         setShowImageZoom(true);
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1
    );
};

const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  return (
    <>
      <div className={`product-card ${isLowStock ? 'low-stock' : ''}`}>
        {/* Product Image */}
        <div 
          className="product-image"
          onClick={() => hasImages && openImageZoom(0)}
          style={{ cursor: hasImages ? 'pointer' : 'default' }}
        >
          {hasImages ? (
            <>
              <img 
                src={product.images[0]} 
                alt={product.name}
                className="product-photo"
              />
              {product.images.length > 1 && (
                <div className="image-counter">
                  1/{product.images.length}
                </div>
              )}
            </>
          ) : (
            <div className="default-icon">
              <Package size={48} strokeWidth={1.5} />
            </div>
          )}
        </div>

        {/* Price badge */}
        {product.sellingPrice && (
          <div className="selling-price-badge">
            <span className="badge-label">Prix de Vente</span>
            <span className="badge-price">{product.sellingPrice.toLocaleString()} CFA</span>
          </div>
        )}

       
         {/* Product Name */}
        <h3 className="product-name">{product.name}</h3>

        {/* Action Buttons */}
        <div className="product-actions">
          <button 
            className="btn-icon"
            onClick={() => onEdit(product)}
            title="Modifier images"
          >
            <Camera size={18} />
          </button>
          <button 
            className="btn-icon btn-danger"
            onClick={() => onDelete(product.id)}
            title="Supprimer"
          >
            <Trash2 size={18} />
          </button>
        </div>

        {/* Stock Display */}
        <div className="product-stock">
          <span className="stock-number">{product.stock}</span>
          <span className="stock-label">en stock</span>
        </div>

        {/* Price info */}
        {product.costPrice && product.sellingPrice && (
          <div className='product-pricing'>
            <div className='price-row'>
              <span className='price-label'>Achat:</span>
              <span className='price-value'>{product.costPrice.toLocaleString()} CFA</span>
            </div>

            <div className='price-row'>
              <span className='price-label'>Vente:</span>
              <span className='price-value selling'>{product.sellingPrice.toLocaleString()} CFA</span>
            </div>

            <div className='price-row profit-row'>
              <span className='price-label'>Profit/unité</span>
              <span className='price-value profit'>+{(product.sellingPrice - product.costPrice).toLocaleString()} CFA</span>
            </div>
          </div>
        )}

        {/* Low Stock Alert */}
        {isLowStock && (
          <div className="alert-badge">
            <AlertTriangle size={14} />
            <span>Stock bas!</span>
          </div>
        )}

        {/* Stock Controls */}
        <div className="stock-controls">
          <button 
            className="btn-quick"
            onClick={handleQuickDecrease}
            disabled={product.stock === 0}
          >
            -1
          </button>
          <button 
            className="btn-bulk btn-decrease"
            onClick={() => onStockChange(product.id, 'bulk-decrease')}
          >
            Vendu
          </button>
          <button 
            className="btn-bulk btn-increase"
            onClick={() => onStockChange(product.id, 'bulk-increase')}
          >
            Reçu
          </button>
          <button 
            className="btn-quick"
            onClick={handleQuickIncrease}
          >
            +1
          </button>
        </div>
      </div>

      {/* Image Zoom Modal */}
      {showImageZoom && hasImages && (
        <div className="image-zoom-overlay" onClick={() => setShowImageZoom(false)}>
          <div className="image-zoom-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="zoom-close"
              onClick={() => setShowImageZoom(false)}
            >
              ✕
            </button>
            
            <img 
              src={product.images[currentImageIndex]} 
              alt={`${product.name} - Angle ${currentImageIndex + 1}`}
              className="zoomed-image"
            />

            {product.images.length > 1 && (
              <>
                <button className="zoom-nav zoom-prev" onClick={prevImage}>
                  ‹
                </button>
                <button className="zoom-nav zoom-next" onClick={nextImage}>
                  ›
                </button>
                <div className="zoom-indicator">
                  {currentImageIndex + 1} / {product.images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;