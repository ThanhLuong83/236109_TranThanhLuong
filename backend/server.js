const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối MongoDB Atlas (Tối ưu auto-reconnect)
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ Kết nối MongoDB Atlas thành công: ${conn.connection.host}`);
  } catch (err) {
    console.error('❌ Lỗi kết nối MongoDB:', err.message);
    setTimeout(connectDB, 5000);
  }
};
connectDB();

// --------------------
// Health Check Endpoint
// --------------------
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// --------------------
// Schema & Model Food
// --------------------
const foodSchema = new mongoose.Schema({
  foodId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  cuisine: { type: String, default: '' },
  ingredients: { type: [String], default: [] },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  description: { type: String, default: '' },
  imageUrl: { type: String, default: '' }
}, { timestamps: true });

const Food = mongoose.model('Food', foodSchema, 'foods');

// --------------------
// API ROUTES
// --------------------

// 1. GET /api/foods - Lấy danh sách món ăn & Tìm kiếm theo từ khóa
app.get('/api/foods', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
          { cuisine: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const foods = await Food.find(query);
    res.json(foods);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server: ' + err.message });
  }
});

// 2. GET /api/foods/:id - Xem chi tiết 1 món ăn
app.get('/api/foods/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ message: 'Không tìm thấy món ăn' });
    }
    res.json(food);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server: ' + err.message });
  }
});

// 3. POST /api/foods - Thêm món ăn mới (Kiểm tra trùng foodId)
app.post('/api/foods', async (req, res) => {
  try {
    const { foodId, name, category, price, quantity } = req.body;

    if (!foodId || !name || !category || price === undefined || quantity === undefined) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ các trường bắt buộc' });
    }

    const existingFood = await Food.findOne({ foodId });
    if (existingFood) {
      return res.status(400).json({ message: 'Mã món ăn (foodId) đã tồn tại' });
    }

    const newFood = await Food.create(req.body);
    res.status(201).json(newFood);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 4. PUT /api/foods/:id - Cập nhật thông tin món ăn
app.put('/api/foods/:id', async (req, res) => {
  try {
    const updatedFood = await Food.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedFood) {
      return res.status(404).json({ message: 'Không tìm thấy món ăn để cập nhật' });
    }
    res.json(updatedFood);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 5. DELETE /api/foods/:id - Xóa món ăn
app.delete('/api/foods/:id', async (req, res) => {
  try {
    const deletedFood = await Food.findByIdAndDelete(req.params.id);
    if (!deletedFood) {
      return res.status(404).json({ message: 'Không tìm thấy món ăn để xóa' });
    }
    res.json({ message: 'Xóa món ăn thành công' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Khởi động Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend Server đang chạy trên port ${PORT}`);
});