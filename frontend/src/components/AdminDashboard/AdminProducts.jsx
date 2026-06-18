import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';

const STOCK_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'In stock', value: 'in_stock' },
  { label: 'Out of stock', value: 'out_of_stock' },
];

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [stock, setStock] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formValues, setFormValues] = useState({ name: '', category: 'men', price: '', available: true });
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
    setFormValues({
      name: product?.name || '',
      category: product?.category || 'men',
      price: product?.price || '',
      available: product?.available ?? true,
    });
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const url = selectedProduct ? `${API}/api/admin/products/${selectedProduct.id}/` : `${API}/api/admin/products/`;
    const method = selectedProduct ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          ...formValues,
          price: Number(formValues.price),
          description: selectedProduct?.description || '',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save product');
      }

      const saved = await response.json();
      setProducts((prev) => {
        if (selectedProduct) {
          return prev.map((item) => (item.id === saved.id ? saved : item));
        }
        return [saved, ...prev];
      });
      setShowModal(false);
    } catch (error) {
      console.error('Save product failed', error);
    }
  };

  const deleteProduct = async (productId) => {
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
          <p className="section-label">Products</p>
          <h2>Manage inventory</h2>
        </div>
        <button type="button" className="admin-primary-btn" onClick={() => openModal(null)}>
          <Plus size={16} /> Add Product
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

      <div className="admin-card admin-table-card">
        {loading ? (
          <div className="admin-loading-state">Loading products...</div>
        ) : filteredProducts.length ? (
          <div className="responsive-table">
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="product-image-cell">
                        <img src={product.image_urls?.[0] || '/logo.png'} alt={product.name} />
                      </div>
                    </td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>${Number(product.price).toFixed(2)}</td>
                    <td>{product.available ? 'In stock' : 'Out of stock'}</td>
                    <td>
                      <span className={`status-pill ${product.available ? 'success' : 'error'}`}>
                        {product.available ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="table-actions-cell">
                      <button type="button" className="icon-button" onClick={() => openModal(product)}>
                        <Edit2 size={16} />
                      </button>
                      <button type="button" className="icon-button danger" onClick={() => deleteProduct(product.id)}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty-state">No products match your filter.</div>
        )}
      </div>

      {showModal && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal">
            <div className="modal-header">
              <h3>{selectedProduct ? 'Edit Product' : 'Add Product'}</h3>
            </div>
            <form className="admin-form" onSubmit={handleFormSubmit}>
              <label>
                Name
                <input
                  type="text"
                  value={formValues.name}
                  onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                  required
                />
              </label>
              <label>
                Category
                <select
                  value={formValues.category}
                  onChange={(e) => setFormValues({ ...formValues, category: e.target.value })}
                >
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                </select>
              </label>
              <label>
                Price
                <input
                  type="number"
                  step="0.01"
                  value={formValues.price}
                  onChange={(e) => setFormValues({ ...formValues, price: e.target.value })}
                  required
                />
              </label>
              <label className="checkbox-field">
                <input
                  type="checkbox"
                  checked={formValues.available}
                  onChange={(e) => setFormValues({ ...formValues, available: e.target.checked })}
                />
                Available
              </label>

              <div className="modal-actions">
                <button type="button" className="secondary-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-primary-btn">
                  Save Product
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
