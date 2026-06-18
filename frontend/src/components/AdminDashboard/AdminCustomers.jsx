import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';

function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API}/api/admin/customers/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        });
        if (!response.ok) {
          setCustomers([]);
          setLoading(false);
          return;
        }
        const result = await response.json();
        setCustomers(result);
      } catch (error) {
        console.error('Admin customers fetch failed', error);
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchCustomers();
  }, [API, token]);

  const filteredCustomers = customers.filter((customer) => {
    const term = search.toLowerCase();
    return (
      customer.username.toLowerCase().includes(term) ||
      customer.email.toLowerCase().includes(term) ||
      `${customer.first_name} ${customer.last_name}`.toLowerCase().includes(term)
    );
  });

  return (
    <div className="admin-page admin-customers-page">
      <div className="admin-page-header">
        <div>
          <p className="section-label">Customers</p>
          <h2>Customer directory</h2>
        </div>
      </div>

      <div className="admin-filter-row">
        <div className="admin-input-group">
          <Search size={16} />
          <input
            type="search"
            placeholder="Search customers"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-card admin-table-card">
        {loading ? (
          <div className="admin-loading-state">Loading customers...</div>
        ) : filteredCustomers.length ? (
          <div className="responsive-table">
            <table>
              <thead>
                <tr>
                  <th>Avatar</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Orders</th>
                  <th>Total spent</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <div className="avatar-circle">{customer.first_name?.[0] || customer.username?.[0] || 'U'}</div>
                    </td>
                    <td>{`${customer.first_name || ''} ${customer.last_name || ''}`.trim() || customer.username}</td>
                    <td>{customer.email}</td>
                    <td>{customer.orders_count}</td>
                    <td>${Number(customer.total_spent).toFixed(2)}</td>
                    <td>{new Date(customer.registration_date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty-state">No customers found.</div>
        )}
      </div>
    </div>
  );
}

export default AdminCustomers;
