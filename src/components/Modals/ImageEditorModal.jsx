import React from 'react';
import { Camera } from 'lucide-react';

const ImageEditorModal = ({ 
  show, 
  onClose, 
  product, 
  setProduct, 
  updateImages 
}) => {
  if (!show || !product) return null;

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal-content' onClick={(e) => e.stopPropagation()}>
        <div className='modal-header'>
          <h2>Modifier Images</h2>
          <button className='modal-close' onClick={onClose}>
            ✕
          </button>
        </div>

        <div className='modal-body'>
          <p className='modal-product-name'>{product.name}</p>

          <div className='image-upload-grid'>
            {[0, 1, 2, 3].map(index => (
              <div key={index} className='image-upload-slot'>
                <label className='image-slot-label'>Angle {index + 1}</label>

                {product.images && product.images[index] ? (
                  <div className='image-preview'>
                    <img
                      src={product.images[index]}
                      alt={`Angle ${index + 1}`}
                      className='preview-image'
                    />
                    <button
                      type='button'
                      className='btn-remove-image'
                      onClick={() => {
                        const newImages = [...(product.images || [])];
                        newImages.splice(index, 1);
                        updateImages(product.id, newImages);
                        setProduct({ ...product, images: newImages });
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <label className='upload-button'>
                    <input 
                      type='file'
                      accept='image/*'
                      capture='environment'
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const newImages = [...(product.images || [])];
                            newImages[index] = reader.result;
                            updateImages(product.id, newImages);
                            setProduct({ ...product, images: newImages });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      style={{ display: 'none' }}
                    />
                    <div className='upload-placeholder'>
                      <Camera size={32} strokeWidth={1.5} />
                      <span>Ajouter</span>
                    </div>
                  </label>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className='modal-footer'>
          <button className='btn-primary' onClick={onClose}>
            Terminé
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageEditorModal;