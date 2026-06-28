import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Upload } from 'lucide-react';

const STOCK_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'In stock', value: 'in_stock' },
  { label: 'Out of stock', value: 'out_of_stock' },
];

const SUBCATEGORY_OPTIONS = [
  { label: 'Shirts', value: 'shirts' },
  { label: 'T-Shirts', value: 't-shirts' },
  { label: 'Pants', value: 'pants' },
  { label: 'Hoodies', value: 'hoodies' },
  { label: 'Suits', value: 'suits' },
  { label: 'Sportwears', value: 'sportwears' },
  { label: 'Tops', value: 'tops' },
  { label: 'Dresses', value: 'dresses' },
  { label: 'Skirts', value: 'skirts' },
  { label: 'Jeans', value: 'jeans' },
];

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [stock, setStock] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState([null, null, null]);
  const [formValues, setFormValues] = useState({
    name: '',
    category: 'men',
    subcategory: 'shirts',
    description: '',
    price: '',
    discount_price: '',
    is_featured: false,
    is_new_arrival: false,
    is_under_ten: false,
    is_bestseller: false,
    available: true,
    colors: '',
    sizes: '',
    images: [null, null, null],
  });
  const [formErrors, setFormErrors] = useState({});
  const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API}/api/products/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        });
        if (!response.ok) {
          setProducts([]);
          setLoading(false);
          return;
        }
        const result = await response.json();
        setProducts(result);
      } catch (error) {
        console.error('Admin products fetch failed', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProducts();
  }, [API, token]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'all' || product.category === category;
      const matchesStock = stock === 'all'
        || (stock === 'in_stock' && product.available)
        || (stock === 'out_of_stock' && !product.available);
      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, search, category, stock]);

  const openModal = (product = null) => {
    setSelectedProduct(product);
    setFormErrors({});
    setImagePreview([
      product?.image_urls?.[0] || null,
      product?.image_urls?.[1] || null,
      product?.image_urls?.[2] || null,
    ]);
    setFormValues({
      name: product?.name || '',
      category: product?.category || 'men',
      subcategory: product?.subcategory || 'shirts',
      description: product?.description || '',
      price: product?.price || '',
      discount_price: product?.discount_price || '',
      is_featured: product?.is_featured || false,
      is_new_arrival: product?.is_new_arrival || false,
      is_under_ten: product?.is_under_ten || false,
      is_bestseller: product?.is_bestseller || false,
      available: product?.available ?? true,
      colors: Array.isArray(product?.colors) ? product.colors.join(', ') : '',
      sizes: Array.isArray(product?.sizes) ? product.sizes.join(', ') : '',
      images: [null, null, null],
    });
    setShowModal(true);
  };

  const handleImageChange = (index, e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPreviews = [...imagePreview];
        newPreviews[index] = reader.result;
        setImagePreview(newPreviews);

        const newImages = [...formValues.images];
        newImages[index] = file;
        setFormValues({ ...formValues, images: newImages });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formValues.name.trim()) errors.name = 'Product name is required';
    if (!formValues.price) errors.price = 'Price is required';
    if (!selectedProduct && !formValues.images[0]) errors.images = 'At least one image is required for new products';
    return errors;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      
      // Text fields
      formData.append('name', formValues.name);
      formData.append('category', formValues.category);
      formData.append('subcategory', formValues.subcategory);
      formData.append('description', formValues.description);
      formData.append('price', formValues.price);
      formData.append('discount_price', formValues.discount_price || '');
      
      // Boolean fields - send as strings (Django will convert)
      formData.append('is_featured', formValues.is_featured ? 'true' : 'false');
      formData.append('is_new_arrival', formValues.is_new_arrival ? 'true' : 'false');
      formData.append('is_under_ten', formValues.is_under_ten ? 'true' : 'false');
      formData.append('is_bestseller', formValues.is_bestseller ? 'true' : 'false');
      formData.append('available', formValues.available ? 'true' : 'false');
      
      // Colors and sizes - convert to JSON array format
      const colors = formValues.colors 
        ? formValues.colors.split(',').map(c => c.trim()).filter(c => c)
        : [];
      const sizes = formValues.sizes 
        ? formValues.sizes.split(',').map(s => s.trim()).filter(s => s)
        : [];
      formData.append('colors', JSON.stringify(colors));
      formData.append('sizes', JSON.stringify(sizes));

      // Append images only if they're new files
      formValues.images.forEach((image, index) => {
        if (image instanceof File) {
          formData.append(`image${index + 1}`, image);
        }
      });

      const url = selectedProduct ? `${API}/api/admin/products/${selectedProduct.id}/` : `${API}/api/admin/products/`;
      const method = selectedProduct ? 'PATCH' : 'POST';

      console.log('Saving product...', { url, method, formData: Object.fromEntries(formData) });

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Token ${token}`,
        },
        body: formData,
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        console.error('Save error response:', responseData);
        const errorMessage = responseData.detail || Object.entries(responseData)
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
          .join(' | ') || 'Failed to save product';
        throw new Error(errorMessage);
      }

      console.log('Product saved successfully:', responseData);
      setProducts((prev) => {
        if (selectedProduct) {
          return prev.map((item) => (item.id === responseData.id ? responseData : item));
        }
        return [responseData, ...prev];
      });
      setShowModal(false);
      setFormErrors({});
    } catch (error) {
      console.error('Save product failed:', error);
      setFormErrors({ submit: error.message || 'Failed to save product' });
    } finally {
      setSubmitting(false);
    }
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const response = await fetch(`${API}/api/admin/products/${productId}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      if (response.ok) {
        setProducts((prev) => prev.filter((product) => product.id !== productId));
      }
    } catch (error) {
      console.error('Delete product failed', error);
    }
  };

  return (
    <div className="admin-page admin-products-page">
      <div className="admin-page-header">
        <div>
          <p className="section-label">Inventory</p>
          <h2>Manage products</h2>
        </div>
        <button type="button" className="admin-primary-btn" onClick={() => openModal(null)}>
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="admin-filter-row">
        <div className="admin-input-group">
          <Search size={16} />
          <input
            type="search"
            placeholder="Search products"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="admin-select-group">
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All categories</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
          </select>
          <select value={stock} onChange={(e) => setStock(e.target.value)}>
            {STOCK_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="admin-card">
        {loading ? (
          <div className="products-loading">
            <div className="skeleton-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton-card"></div>
              ))}
            </div>
          </div>
        ) : filteredProducts.length ? (
          <div className="admin-products-grid">
            {filteredProducts.map((product) => (
              <div key={product.id} className="admin-product-card" style={{ animation: 'slideInUp 0.4s ease-out' }}>
                <div className="product-image-container">
                  <img 
                    src={product.image_urls?.[0] || '/logo.png'} 
                    alt={product.name}
                    className="product-image"
                  />
                  <div className="product-overlay">
                    <button 
                      type="button" 
                      className="overlay-edit-btn"
                      onClick={() => openModal(product)}
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      type="button" 
                      className="overlay-delete-btn"
                      onClick={() => deleteProduct(product.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <span className={`stock-badge ${product.available ? 'in-stock' : 'out-of-stock'}`}>
                    {product.available ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <div className="product-info-container">
                  <h4>{product.name}</h4>
                  <p className="product-category">{product.subcategory}</p>
                  <div className="product-price-row">
                    <p className="product-price">${Number(product.price).toFixed(2)}</p>
                    {product.discount_price && (
                      <p className="product-discount">${Number(product.discount_price).toFixed(2)}</p>
                    )}
                  </div>
                  <div className="product-badges">
                    {product.is_featured && <span className="badge-featured">Featured</span>}
                    {product.is_new_arrival && <span className="badge-new">New</span>}
                    {product.is_bestseller && <span className="badge-bestseller">Bestseller</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="admin-empty-state">No products match your filter.</div>
        )}
      </div>

      {showModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="admin-modal admin-modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button 
                type="button" 
                className="modal-close-btn"
                onClick={() => setShowModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <form className="admin-form product-form" onSubmit={handleFormSubmit}>
              {formErrors.submit && <div className="form-error-alert">{formErrors.submit}</div>}
              
              {/* Basic Information Section */}
              <div className="form-section">
                <h4 className="form-section-title">Basic Information</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Product Name *</label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Enter product name"
                      value={formValues.name}
                      onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                      className={formErrors.name ? 'input-error' : ''}
                    />
                    {formErrors.name && <span className="field-error">{formErrors.name}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="category">Category *</label>
                    <select
                      id="category"
                      value={formValues.category}
                      onChange={(e) => setFormValues({ ...formValues, category: e.target.value })}
                    >
                      <option value="men">Men</option>
                      <option value="women">Women</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="subcategory">Subcategory *</label>
                    <select
                      id="subcategory"
                      value={formValues.subcategory}
                      onChange={(e) => setFormValues({ ...formValues, subcategory: e.target.value })}
                    >
                      {SUBCATEGORY_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    placeholder="Enter product description"
                    value={formValues.description}
                    onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>

              {/* Pricing Section */}
              <div className="form-section">
                <h4 className="form-section-title">Pricing</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="price">Price ($) *</label>
                    <input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formValues.price}
                      onChange={(e) => setFormValues({ ...formValues, price: e.target.value })}
                      className={formErrors.price ? 'input-error' : ''}
                    />
                    {formErrors.price && <span className="field-error">{formErrors.price}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="discount">Discount Price ($)</label>
                    <input
                      id="discount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formValues.discount_price}
                      onChange={(e) => setFormValues({ ...formValues, discount_price: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Options Section */}
              <div className="form-section">
                <h4 className="form-section-title">Product Options</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="colors">Colors (comma-separated)</label>
                    <input
                      id="colors"
                      type="text"
                      placeholder="e.g., Red, Blue, Black"
                      value={formValues.colors}
                      onChange={(e) => setFormValues({ ...formValues, colors: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="sizes">Sizes (comma-separated)</label>
                    <input
                      id="sizes"
                      type="text"
                      placeholder="e.g., S, M, L, XL"
                      value={formValues.sizes}
                      onChange={(e) => setFormValues({ ...formValues, sizes: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Images Section */}
              <div className="form-section">
                <h4 className="form-section-title">Product Images</h4>
                {formErrors.images && <span className="field-error">{formErrors.images}</span>}
                <div className="images-grid">
                  {[0, 1, 2].map((index) => (
                    <div key={index} className="image-upload-wrapper">
                      <div className="image-preview-container">
                        {imagePreview[index] ? (
                          <>
                            <img src={imagePreview[index]} alt={`Product ${index + 1}`} />
                            <button
                              type="button"
                              className="remove-image-btn"
                              onClick={() => {
                                const newPreviews = [...imagePreview];
                                newPreviews[index] = null;
                                setImagePreview(newPreviews);
                                const newImages = [...formValues.images];
                                newImages[index] = null;
                                setFormValues({ ...formValues, images: newImages });
                              }}
                            >
                              <X size={16} />
                            </button>
                          </>
                        ) : (
                          <label className="image-upload-label">
                            <Upload size={24} />
                            <span>Image {index + 1}</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageChange(index, e)}
                              style={{ display: 'none' }}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status & Features Section */}
              <div className="form-section">
                <h4 className="form-section-title">Status & Features</h4>
                <div className="form-grid">
                  <label className="checkbox-field">
                    <input
                      type="checkbox"
                      checked={formValues.available}
                      onChange={(e) => setFormValues({ ...formValues, available: e.target.checked })}
                    />
                    <span>Available</span>
                  </label>
                  <label className="checkbox-field">
                    <input
                      type="checkbox"
                      checked={formValues.is_featured}
                      onChange={(e) => setFormValues({ ...formValues, is_featured: e.target.checked })}
                    />
                    <span>Featured Product</span>
                  </label>
                  <label className="checkbox-field">
                    <input
                      type="checkbox"
                      checked={formValues.is_new_arrival}
                      onChange={(e) => setFormValues({ ...formValues, is_new_arrival: e.target.checked })}
                    />
                    <span>New Arrival</span>
                  </label>
                  <label className="checkbox-field">
                    <input
                      type="checkbox"
                      checked={formValues.is_bestseller}
                      onChange={(e) => setFormValues({ ...formValues, is_bestseller: e.target.checked })}
                    />
                    <span>Bestseller</span>
                  </label>
                  <label className="checkbox-field">
                    <input
                      type="checkbox"
                      checked={formValues.is_under_ten}
                      onChange={(e) => setFormValues({ ...formValues, is_under_ten: e.target.checked })}
                    />
                    <span>Under $10</span>
                  </label>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="secondary-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-primary-btn" disabled={submitting}>
                  {submitting ? 'Saving...' : selectedProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;
