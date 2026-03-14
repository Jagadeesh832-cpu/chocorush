/**
 * Admin Dashboard - Full CRUD for products, orders, sections, users
 * Role-based: Only admin users can access (ProtectedRoute + redirect)
 * - Products: Add, Edit, Delete, Enable/Disable
 * - Orders: View and update status
 * - Sections: Edit website content (Hero, About, Contact)
 * - Users: Manage user roles (Admin, Customer, Delivery)
 */
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { adminApi } from '../api/client'
import ChocolateImage from '../components/ChocolateImage'

const API_BASE = '/api'

async function fetchWithAuth(endpoint, options = {}) {
  const token = localStorage.getItem('chocorush-token')
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

// Product categories - must match backend Product schema enum
const CATEGORIES = ['Truffles', 'Fudge', 'Assorted', 'Nuts', 'Sugar-Free']

export default function Admin() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [tab, setTab] = useState('products')
  const [editing, setEditing] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [sections, setSections] = useState([])
  const [users, setUsers] = useState([])
  const [editingSection, setEditingSection] = useState(null)
  const [sectionForm, setSectionForm] = useState({ key: '', title: '', contentJson: '{}', isEnabled: true })
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: 'Truffles',
    stock: 100,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/login')
      return
    }
    load()
  }, [user, navigate])

  async function load() {
    setLoading(true)
    setError('')
    try {
      const [s, o, p, sec, usr] = await Promise.all([
        adminApi.stats(),
        adminApi.orders(),
        adminApi.products(),
        adminApi.sections(),
        adminApi.users().catch(() => []),
      ])
      setStats(s)
      setOrders(o)
      setProducts(Array.isArray(p) ? p : [])
      setSections(Array.isArray(sec) ? sec : [])
      setUsers(Array.isArray(usr) ? usr : [])
    } catch (err) {
      setError(err.message)
      if (err.message?.includes('401') || err.message?.includes('403')) navigate('/login')
    } finally {
      setLoading(false)
    }
  }

  async function updateOrderStatus(orderId, status) {
    try {
      await fetchWithAuth(`/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      })
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  async function saveProduct(e) {
    e.preventDefault()
    try {
      const payload = { ...formData, price: Number(formData.price), stock: Number(formData.stock) || 100 }
      if (editing) {
        await fetchWithAuth(`/products/${editing}`, { method: 'PUT', body: JSON.stringify(payload) })
      } else {
        await fetchWithAuth('/products', { method: 'POST', body: JSON.stringify(payload) })
      }
      resetForm()
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  async function deleteProduct(id) {
    try {
      await fetchWithAuth(`/products/${id}`, { method: 'DELETE' })
      setDeleteConfirm(null)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  // Toggle product active/inactive (enable/disable)
  async function toggleProductActive(product) {
    try {
      await fetchWithAuth(`/products/${product._id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...product, isActive: !product.isActive }),
      })
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  // Save section - create or update
  async function saveSection(e) {
    e.preventDefault()
    try {
      let content = {}
      try {
        content = JSON.parse(sectionForm.contentJson || '{}')
      } catch {
        setError('Invalid JSON in content')
        return
      }
      const payload = { key: sectionForm.key, title: sectionForm.title, content, isEnabled: sectionForm.isEnabled }
      if (editingSection) {
        await adminApi.updateSection(editingSection.key, payload)
      } else {
        await adminApi.createSection(payload)
      }
      setEditingSection(null)
      setSectionForm({ key: '', title: '', contentJson: '{}', isEnabled: true })
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  async function deleteSection(key) {
    try {
      await adminApi.deleteSection(key)
      setEditingSection(null)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  async function updateUserRole(userId, role) {
    try {
      await adminApi.updateUserRole(userId, role)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  function resetForm() {
    setEditing(null)
    setFormData({
      name: '',
      description: '',
      price: '',
      image: '',
      category: 'Truffles',
      stock: 100,
    })
  }

  function startEdit(p) {
    setEditing(p._id)
    setFormData({
      name: p.name,
      description: p.description || '',
      price: p.price,
      image: p.image || '',
      category: p.category || 'Truffles',
      stock: p.stock ?? 100,
    })
  }

  if (user?.role !== 'admin') return null

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-chocolate-900">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <h1 className="font-playfair text-3xl font-bold text-gold-500">Admin Dashboard</h1>
          <div className="flex gap-4">
            <Link to="/admin/orders" className="text-gray-400 hover:text-gold-500 transition-colors">Order Management</Link>
            <Link to="/" className="text-gray-400 hover:text-gold-500 transition-colors">← Home</Link>
          </div>
        </div>
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/20 text-red-400 text-sm">{error}</div>
        )}
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : (
          <>
            {stats && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
              >
                {[
                  { label: 'Products', value: stats.productCount },
                  { label: 'Orders', value: stats.orderCount },
                  { label: 'Bookings', value: stats.bookingCount },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="p-5 rounded-xl bg-chocolate-800/80 backdrop-blur border border-gold-500/20"
                  >
                    <p className="text-gray-400 text-sm">{s.label}</p>
                    <p className="text-2xl font-bold text-gold-500">{s.value}</p>
                  </div>
                ))}
              </motion.div>
            )}

            <div className="flex flex-wrap gap-4 mb-6">
              {['products', 'orders', 'sections', 'users'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    tab === t
                      ? 'bg-gold-500 text-chocolate-900'
                      : 'bg-chocolate-800/80 text-gray-400 hover:text-white border border-gold-500/20'
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            {tab === 'products' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                {/* Add/Edit form */}
                <div className="p-6 rounded-2xl bg-chocolate-800/80 backdrop-blur border border-gold-500/20">
                  <h3 className="font-playfair text-xl text-gold-500 mb-4">
                    {editing ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  <form onSubmit={saveProduct} className="grid sm:grid-cols-2 gap-4">
                    <input
                      required
                      placeholder="Product name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-chocolate-900 border border-gold-500/30 text-white placeholder-gray-500 focus:border-gold-500 outline-none"
                    />
                    <input
                      required
                      type="number"
                      placeholder="Price (₹)"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-chocolate-900 border border-gold-500/30 text-white placeholder-gray-500 focus:border-gold-500 outline-none"
                    />
                    <textarea
                      required
                      placeholder="Description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="sm:col-span-2 w-full px-4 py-3 rounded-lg bg-chocolate-900 border border-gold-500/30 text-white placeholder-gray-500 focus:border-gold-500 outline-none"
                      rows={2}
                    />
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-chocolate-900 border border-gold-500/30 text-white focus:border-gold-500 outline-none"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Stock"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-chocolate-900 border border-gold-500/30 text-white placeholder-gray-500 focus:border-gold-500 outline-none"
                    />
                    <input
                      placeholder="Image URL"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="sm:col-span-2 w-full px-4 py-3 rounded-lg bg-chocolate-900 border border-gold-500/30 text-white placeholder-gray-500 focus:border-gold-500 outline-none"
                    />
                    <div className="sm:col-span-2 flex gap-2">
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-5 py-2 bg-gold-500 text-chocolate-900 font-semibold rounded-lg"
                      >
                        {editing ? 'Update' : 'Add Product'}
                      </motion.button>
                      {editing && (
                        <button
                          type="button"
                          onClick={resetForm}
                          className="px-5 py-2 text-gray-400 hover:text-white"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Product list - show all products, inactive greyed out */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((p) => (
                      <motion.div
                        key={p._id}
                        layout
                        className={`p-4 rounded-xl backdrop-blur border flex gap-4 transition-colors ${
                          p.isActive === false
                            ? 'bg-chocolate-900/60 border-gray-600/40 opacity-70'
                            : 'bg-chocolate-800/80 border-gold-500/20 hover:border-gold-500/40'
                        }`}
                      >
                        <ChocolateImage
                          src={p.image}
                          alt={p.name}
                          className="w-20 h-20 object-cover rounded-lg shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">{p.name}</p>
                          <p className="text-gold-500 text-sm">₹{p.price} · {p.category}</p>
                          <p className="text-gray-500 text-xs">Stock: {p.stock ?? 100}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <button
                              onClick={() => startEdit(p)}
                              className="text-sm text-gold-500 hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => toggleProductActive(p)}
                              className="text-sm text-amber-400 hover:underline"
                            >
                              {p.isActive === false ? 'Enable' : 'Disable'}
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(p)}
                              className="text-sm text-red-400 hover:underline"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            )}

            {tab === 'sections' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="p-6 rounded-2xl bg-chocolate-800/80 backdrop-blur border border-gold-500/20">
                  <h3 className="font-playfair text-xl text-gold-500 mb-4">
                    {editingSection ? 'Edit Section' : 'Add Website Section'}
                  </h3>
                  <form onSubmit={saveSection} className="grid sm:grid-cols-2 gap-4">
                    <input
                      required
                      placeholder="Section key (e.g. hero, about, contact)"
                      value={sectionForm.key}
                      onChange={(e) => setSectionForm({ ...sectionForm, key: e.target.value.toLowerCase().replace(/\s/g, '-') })}
                      disabled={!!editingSection}
                      className="w-full px-4 py-3 rounded-lg bg-chocolate-900 border border-gold-500/30 text-white placeholder-gray-500 focus:border-gold-500 outline-none disabled:opacity-60"
                    />
                    <input
                      placeholder="Section title"
                      value={sectionForm.title}
                      onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-chocolate-900 border border-gold-500/30 text-white placeholder-gray-500 focus:border-gold-500 outline-none"
                    />
                    <label className="flex items-center gap-2 text-gray-400 col-span-2">
                      <input
                        type="checkbox"
                        checked={sectionForm.isEnabled}
                        onChange={(e) => setSectionForm({ ...sectionForm, isEnabled: e.target.checked })}
                        className="rounded text-gold-500"
                      />
                      Section enabled
                    </label>
                    <textarea
                      placeholder='Content as JSON (e.g. {"heading":"Hello","text":"..."})'
                      value={sectionForm.contentJson}
                      onChange={(e) => setSectionForm({ ...sectionForm, contentJson: e.target.value || '{}' })}
                      className="sm:col-span-2 w-full px-4 py-3 rounded-lg bg-chocolate-900 border border-gold-500/30 text-white font-mono text-sm"
                      rows={4}
                    />
                    <div className="sm:col-span-2 flex gap-2">
                      <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="px-5 py-2 bg-gold-500 text-chocolate-900 font-semibold rounded-lg">
                        {editingSection ? 'Save' : 'Add Section'}
                      </motion.button>
                      {editingSection && (
                        <button type="button" onClick={() => { setEditingSection(null); setSectionForm({ key: '', title: '', contentJson: '{}', isEnabled: true }); }} className="px-5 py-2 text-gray-400 hover:text-white">Cancel</button>
                      )}
                    </div>
                  </form>
                </div>
                <div className="grid gap-4">
                  {sections.map((sec) => (
                    <div key={sec.key} className="p-4 rounded-xl bg-chocolate-800/80 border border-gold-500/20 flex justify-between items-center">
                      <div>
                        <p className="text-white font-medium">{sec.key}</p>
                        <p className="text-gray-500 text-sm">{sec.title || '—'}</p>
                        <span className={`text-xs px-2 py-0.5 rounded ${sec.isEnabled !== false ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-500'}`}>
                          {sec.isEnabled !== false ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingSection(sec); setSectionForm({ key: sec.key, title: sec.title || '', contentJson: JSON.stringify(sec.content || {}, null, 2), isEnabled: sec.isEnabled !== false }); }} className="text-sm text-gold-500 hover:underline">Edit</button>
                        <button onClick={() => window.confirm('Delete this section?') && deleteSection(sec.key)} className="text-sm text-red-400 hover:underline">Delete</button>
                      </div>
                    </div>
                  ))}
                  {sections.length === 0 && <p className="text-gray-400 p-6 rounded-xl bg-chocolate-800/80 border border-gold-500/20">No sections yet. Add hero, about, contact etc.</p>}
                </div>
              </motion.div>
            )}

            {tab === 'users' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                {users.length === 0 ? (
                  <p className="text-gray-400 p-8 rounded-xl bg-chocolate-800/80 border border-gold-500/20">No users</p>
                ) : (
                  users.map((u) => (
                    <div key={u._id} className="p-5 rounded-xl bg-chocolate-800/80 border border-gold-500/20 flex flex-wrap justify-between items-center gap-4">
                      <div>
                        <p className="text-white font-medium">{u.name}</p>
                        <p className="text-gray-500 text-sm">{u.email}</p>
                        <span className={`text-xs px-2 py-0.5 rounded mt-1 inline-block ${u.role === 'admin' ? 'bg-gold-500/20 text-gold-400' : 'bg-gray-500/20 text-gray-400'}`}>{u.role}</span>
                      </div>
                      <select
                        value={u.role}
                        onChange={(e) => updateUserRole(u._id, e.target.value)}
                        className="px-3 py-1.5 rounded-lg bg-chocolate-900 text-white border border-gold-500/30"
                      >
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                        <option value="delivery">Delivery</option>
                      </select>
                    </div>
                  ))
                )}
              </motion.div>
            )}

            {tab === 'orders' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                {orders.length === 0 ? (
                  <p className="text-gray-400 p-8 rounded-xl bg-chocolate-800/80 border border-gold-500/20">
                    No orders yet
                  </p>
                ) : (
                  orders.map((order) => (
                    <div
                      key={order._id}
                      className="p-5 rounded-xl bg-chocolate-800/80 backdrop-blur border border-gold-500/20"
                    >
                      <div className="flex flex-wrap justify-between gap-4 items-start mb-2">
                        <div>
                          <p className="text-white font-medium">{order.name || order.user?.name || 'Customer'}</p>
                          <p className="text-gray-500 text-sm">{order.phone || order.user?.email || '-'}</p>
                          <p className="text-gray-500 text-sm truncate max-w-md">
                            {order.address || (order.deliveryAddress && [
                              order.deliveryAddress.street,
                              order.deliveryAddress.city,
                              order.deliveryAddress.state,
                            ].filter(Boolean).join(', ')) || '-'}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                            className="px-3 py-1.5 rounded-lg bg-chocolate-900 text-white border border-gold-500/30"
                          >
                            <option value="Ordered">Ordered</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                          <span className="text-gold-500 font-bold">₹{order.totalPrice}</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-400">
                        {order.items?.map((i) => `${i.name} × ${i.quantity}`).join(', ') ||
                          order.products?.map((p) => `${p.product?.name || 'Item'} × ${p.quantity || 1}`).join(', ') || '-'}
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="p-6 rounded-2xl bg-chocolate-800 border border-gold-500/30 max-w-sm w-full"
            >
              <h3 className="font-playfair text-xl text-white mb-2">Delete Product?</h3>
              <p className="text-gray-400 text-sm mb-6">
                Are you sure you want to delete "{deleteConfirm.name}"? This cannot be undone.
              </p>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => deleteProduct(deleteConfirm._id)}
                  className="flex-1 py-2 rounded-lg bg-red-500/20 text-red-400 font-medium hover:bg-red-500/30"
                >
                  Delete
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2 rounded-lg bg-gold-500/20 text-gold-500 font-medium hover:bg-gold-500/30"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
