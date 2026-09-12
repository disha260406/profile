const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;
const uploadDir = path.join(__dirname, 'uploads');
const dataDir = path.join(__dirname, 'data');
const avatarDataPath = path.join(dataDir, 'avatar.json');
const DEFAULT_AVATAR_URL = 'https://drive.google.com/uc?export=view&id=1ycNk69MKFmUufhCEImxIgucgW7RkdzPt';

app.use(express.static(__dirname));
app.use('/uploads', express.static('uploads'));

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

function normalizeAvatarUrl(input) {
  if (!input) return '/uploads/default-avatar.svg';

  if (typeof input !== 'string') return '/uploads/default-avatar.svg';

  const trimmed = input.trim();
  if (!trimmed) return '/uploads/default-avatar.svg';

  const googleMatch = trimmed.match(/drive\.google\.com\/file\/d\/([A-Za-z0-9_-]+)/i);
  if (googleMatch) {
    return `https://drive.google.com/uc?export=view&id=${googleMatch[1]}`;
  }

  return trimmed;
}

function getSavedAvatarUrl() {
  try {
    if (!fs.existsSync(avatarDataPath)) {
      return normalizeAvatarUrl(DEFAULT_AVATAR_URL);
    }

    const raw = fs.readFileSync(avatarDataPath, 'utf8');
    const parsed = JSON.parse(raw);
    return normalizeAvatarUrl(parsed.imageUrl || DEFAULT_AVATAR_URL);
  } catch (error) {
    return normalizeAvatarUrl(DEFAULT_AVATAR_URL);
  }
}

function saveAvatarUrl(imageUrl) {
  const finalImageUrl = normalizeAvatarUrl(imageUrl);
  fs.writeFileSync(avatarDataPath, JSON.stringify({ imageUrl: finalImageUrl }, null, 2));
  return finalImageUrl;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.png';
    const base = path.basename(file.originalname, ext).replace(/\s+/g, '-').toLowerCase();
    cb(null, `${Date.now()}-${base}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only JPG, PNG, and WEBP images are allowed'));
  }
});

app.use(express.json());
app.use(express.static(__dirname));
app.use('/uploads', express.static(uploadDir));

app.get('/api/current-avatar', (req, res) => {
  res.json({ imageUrl: getSavedAvatarUrl() });
});

app.post('/api/set-avatar-url', (req, res) => {
  const { imageUrl } = req.body || {};
  if (!imageUrl) {
    return res.status(400).json({ message: 'Image URL is required' });
  }

  const finalImageUrl = saveAvatarUrl(imageUrl);
  res.json({ imageUrl: finalImageUrl });
});

app.post('/api/upload-avatar', upload.single('avatar'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file uploaded' });
  }

  const imageUrl = saveAvatarUrl(`/uploads/${req.file.filename}`);
  res.json({ imageUrl });
});

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({ message: error.message });
  }
  if (error) {
    return res.status(400).json({ message: error.message || 'Upload failed' });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
