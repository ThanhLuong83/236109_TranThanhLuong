import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);

  const [formData, setFormData] = useState({
    foodId: '',
    name: '',
    category: '',
    cuisine: '',
    ingredients: '',
    price: '',
    quantity: '',
    description: '',
    imageUrl: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchFoods = async (keyword = '') => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API_BASE_URL}/api/foods${keyword ? `?search=${keyword}` : ''}`);
      setFoods(res.data);
    } catch (err) {
      setError('Lỗi khi tải danh sách món ăn: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFoods(search);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const payload = {
      ...formData,
      price: Number(formData.price),
      quantity: Number(formData.quantity),
      ingredients: typeof formData.ingredients === 'string' 
        ? formData.ingredients.split(',').map(i => i.trim()).filter(Boolean)
        : formData.ingredients
    };

    try {
      if (isEditing) {
        await axios.put(`${API_BASE_URL}/api/foods/${editId}`, payload);
        setMessage('Cập nhật món ăn thành công!');
      } else {
        await axios.post(`${API_BASE_URL}/api/foods`, payload);
        setMessage('Thêm món ăn mới thành công!');
      }
      resetForm();
      fetchFoods();
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi xử lý dữ liệu');
    }
  };

  const handleEdit = (food) => {
    setIsEditing(true);
    setEditId(food._id);
    setFormData({
      foodId: food.foodId,
      name: food.name,
      category: food.category,
      cuisine: food.cuisine || '',
      ingredients: Array.isArray(food.ingredients) ? food.ingredients.join(', ') : '',
      price: food.price,
      quantity: food.quantity,
      description: food.description || '',
      imageUrl: food.imageUrl || ''
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa món ăn này?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/foods/${id}`);
      setMessage('Xóa món ăn thành công!');
      fetchFoods();
    } catch (err) {
      setError('Lỗi khi xóa món ăn');
    }
  };

  const resetForm = () => {
    setFormData({
      foodId: '',
      name: '',
      category: '',
      cuisine: '',
      ingredients: '',
      price: '',
      quantity: '',
      description: '',
      imageUrl: ''
    });
    setIsEditing(false);
    setEditId(null);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1100px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#2c3e50' }}>Hệ Thống Quản Lý Món Ăn - MSSV: 236109</h1>
      <p style={{ textAlign: 'center', fontWeight: 'bold' }}>Sinh viên: Trần Thanh Lượng</p>

      {/* Thông báo */}
      {message && <div style={{ padding: '10px', backgroundColor: '#d4edda', color: '#155724', marginBottom: '15px', borderRadius: '4px' }}>{message}</div>}
      {error && <div style={{ padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', marginBottom: '15px', borderRadius: '4px' }}>{error}</div>}

      {/* Thanh Tìm Kiếm */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Tìm kiếm theo tên, loại món, vùng miền..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, padding: '10px', fontSize: '16px' }}
        />
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#3498db', color: '#fff', border: 'none', cursor: 'pointer' }}>Tìm kiếm</button>
        <button type="button" onClick={() => { setSearch(''); fetchFoods(''); }} style={{ padding: '10px 15px', backgroundColor: '#7f8c8d', color: '#fff', border: 'none', cursor: 'pointer' }}>Làm mới</button>
      </form>

      {/* Form Thêm / Cập Nhật */}
      <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '8px', marginBottom: '25px', border: '1px solid #ddd' }}>
        <h3>{isEditing ? 'Cập Nhật Món Ăn' : 'Thêm Món Ăn Mới'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <input type="text" name="foodId" placeholder="Mã món ăn (foodId) *" value={formData.foodId} onChange={handleInputChange} disabled={isEditing} required style={{ padding: '8px' }} />
          <input type="text" name="name" placeholder="Tên món ăn *" value={formData.name} onChange={handleInputChange} required style={{ padding: '8px' }} />
          <input type="text" name="category" placeholder="Loại món (vd: Món nước) *" value={formData.category} onChange={handleInputChange} required style={{ padding: '8px' }} />
          <input type="text" name="cuisine" placeholder="Vùng miền (vd: Miền Nam)" value={formData.cuisine} onChange={handleInputChange} style={{ padding: '8px' }} />
          <input type="number" name="price" placeholder="Giá bán (VND) *" value={formData.price} onChange={handleInputChange} required style={{ padding: '8px' }} />
          <input type="number" name="quantity" placeholder="Số lượng *" value={formData.quantity} onChange={handleInputChange} required style={{ padding: '8px' }} />
          <input type="text" name="ingredients" placeholder="Nguyên liệu (cách nhau bởi dấu phẩy)" value={formData.ingredients} onChange={handleInputChange} style={{ padding: '8px', gridColumn: 'span 2' }} />
          <input type="text" name="imageUrl" placeholder="URL Hình ảnh" value={formData.imageUrl} onChange={handleInputChange} style={{ padding: '8px', gridColumn: 'span 2' }} />
          <textarea name="description" placeholder="Mô tả món ăn" value={formData.description} onChange={handleInputChange} style={{ padding: '8px', gridColumn: 'span 2', height: '60px' }}></textarea>
          
          <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px' }}>
            <button type="submit" style={{ padding: '10px 20px', backgroundColor: isEditing ? '#e67e22' : '#2ecc71', color: '#fff', border: 'none', cursor: 'pointer' }}>
              {isEditing ? 'Lưu Cập Nhật' : 'Thêm Món Ăn'}
            </button>
            {isEditing && (
              <button type="button" onClick={resetForm} style={{ padding: '10px 15px', backgroundColor: '#95a5a6', color: '#fff', border: 'none', cursor: 'pointer' }}>Hủy Bỏ</button>
            )}
          </div>
        </form>
      </div>

      {/* Danh Sách Món Ăn */}
      <h3>Danh Sách Món Ăn</h3>
      {loading ? <p>Đang tải dữ liệu...</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }} border="1" cellPadding="10">
          <thead>
            <tr style={{ backgroundColor: '#2c3e50', color: '#fff' }}>
              <th>Mã</th>
              <th>Tên món</th>
              <th>Loại</th>
              <th>Giá (VND)</th>
              <th>Số lượng</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {foods.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center' }}>Không tìm thấy món ăn nào</td></tr>
            ) : (
              foods.map((food) => (
                <tr key={food._id}>
                  <td>{food.foodId}</td>
                  <td><strong>{food.name}</strong></td>
                  <td>{food.category}</td>
                  <td>{food.price?.toLocaleString()}</td>
                  <td>{food.quantity}</td>
                  <td style={{ display: 'flex', gap: '5px' }}>
                    <button onClick={() => setSelectedFood(food)} style={{ backgroundColor: '#3498db', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Xem</button>
                    <button onClick={() => handleEdit(food)} style={{ backgroundColor: '#f39c12', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Sửa</button>
                    <button onClick={() => handleDelete(food._id)} style={{ backgroundColor: '#e74c3c', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Xóa</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Modal Xem Chi Tiết */}
      {selectedFood && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', maxWidth: '500px', width: '100%' }}>
            <h2>Chi Tiết Món Ăn</h2>
            <p><strong>Mã món:</strong> {selectedFood.foodId}</p>
            <p><strong>Tên món:</strong> {selectedFood.name}</p>
            <p><strong>Loại món:</strong> {selectedFood.category}</p>
            <p><strong>Ẩm thực / Vùng miền:</strong> {selectedFood.cuisine || 'Chưa cập nhật'}</p>
            <p><strong>Giá bán:</strong> {selectedFood.price?.toLocaleString()} VND</p>
            <p><strong>Số lượng:</strong> {selectedFood.quantity}</p>
            <p><strong>Nguyên liệu:</strong> {Array.isArray(selectedFood.ingredients) ? selectedFood.ingredients.join(', ') : ''}</p>
            <p><strong>Mô tả:</strong> {selectedFood.description}</p>
            {selectedFood.imageUrl && <img src={selectedFood.imageUrl} alt={selectedFood.name} style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '4px' }} />}
            <br/><br/>
            <button onClick={() => setSelectedFood(null)} style={{ padding: '8px 15px', backgroundColor: '#e74c3c', color: '#fff', border: 'none', cursor: 'pointer' }}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;