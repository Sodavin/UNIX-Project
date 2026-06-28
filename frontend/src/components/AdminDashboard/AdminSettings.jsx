import { useEffect, useState } from 'react';

function AdminSettings() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API}/api/admin/settings/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        });
        if (!response.ok) {
          setSettings({});
          setLoading(false);
          return;
        }
        const data = await response.json();
        setSettings(data);
      } catch (error) {
        console.error('Admin settings fetch failed', error);
        setSettings({});
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchSettings();
  }, [API, token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await fetch(`${API}/api/admin/settings/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(settings),
      });
      if (!response.ok) {
        throw new Error('Save failed');
      }
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Admin settings save failed', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page admin-settings-page">
      <div className="admin-page-header">
        <div>
          <p className="section-label">Settings</p>
          <h2>Store configuration</h2>
        </div>
      </div>

      <div className="admin-card admin-settings-card">
        {loading ? (
          <div className="admin-loading-state">Loading store settings...</div>
        ) : (
          <form className="admin-form" onSubmit={handleSubmit}>
            <label>
              Store Name
              <input
                type="text"
                value={settings.store_name || ''}
                onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={settings.email || ''}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              />
            </label>
            <label>
              Phone
              <input
                type="text"
                value={settings.phone || ''}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              />
            </label>
            <label>
              Currency
              <input
                type="text"
                value={settings.currency || ''}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
              />
            </label>
            <label>
              Shipping Settings
              <textarea
                rows="4"
                value={settings.shipping_info || ''}
                onChange={(e) => setSettings({ ...settings, shipping_info: e.target.value })}
              />
            </label>
            <button type="submit" className="admin-primary-btn" disabled={saving}>
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default AdminSettings;
