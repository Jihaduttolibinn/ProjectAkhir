const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authMiddleware, adminMiddleware, apiKeyMiddleware } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Konfigurasi Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Get all books
router.get('/', async (req, res) => {
    try {
        const [books] = await db.execute('SELECT * FROM books');
        res.json(books);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Endpoint untuk penggunaan Open API via x-api-key (Public)
router.get('/public', apiKeyMiddleware('Internal'), async (req, res) => {
    try {
        const [books] = await db.execute('SELECT id, title, author, category, description, image_url FROM books');
        res.json(books);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Endpoint untuk simulasi API Eksternal (Data Random)
router.get('/external', apiKeyMiddleware('External'), async (req, res) => {
    const externalBooks = [
        { id: 101, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Classic', description: 'A story of wealth and love in the Roaring Twenties.', image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400' },
        { id: 102, title: '1984', author: 'George Orwell', category: 'Dystopian', description: 'A chilling prophecy about the future of authoritarianism.', image_url: 'https://images.unsplash.com/photo-1543004218-ee14110433ea?auto=format&fit=crop&q=80&w=400' },
        { id: 103, title: 'Sapiens', author: 'Yuval Noah Harari', category: 'History', description: 'A brief history of humankind from the Stone Age to now.', image_url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400' },
        { id: 104, title: 'Atomic Habits', author: 'James Clear', category: 'Self-Help', description: 'An easy and proven way to build good habits.', image_url: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=400' },
        { id: 105, title: 'The Alchemist', author: 'Paulo Coelho', category: 'Fantasy', description: 'A fable about following your dream.', image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400' },
        { id: 106, title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', category: 'Psychology', description: 'Exploring the two systems that drive our thoughts.', image_url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=400' },
        { id: 107, title: 'Pride and Prejudice', author: 'Jane Austen', category: 'Romance', description: 'A classic novel of manners and marriage.', image_url: 'https://images.unsplash.com/photo-1521123845962-829d49488a09?auto=format&fit=crop&q=80&w=400' },
        { id: 108, title: 'The Hobbit', author: 'J.R.R. Tolkien', category: 'Fantasy', description: 'The precursor to The Lord of the Rings.', image_url: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?auto=format&fit=crop&q=80&w=400' },
        { id: 109, title: 'Brave New World', author: 'Aldous Huxley', category: 'Sci-Fi', description: 'A futuristic search for meaning in a perfect society.', image_url: 'https://images.unsplash.com/photo-1451187530230-b23b99593740?auto=format&fit=crop&q=80&w=400' },
        { id: 110, title: 'The Silent Patient', author: 'Alex Michaelides', category: 'Thriller', description: 'A shocking psychological mystery.', image_url: 'https://images.unsplash.com/photo-1586075010623-2658397f394f?auto=format&fit=crop&q=80&w=400' },
        { id: 111, title: 'Clean Code', author: 'Robert C. Martin', category: 'Programming', description: 'A handbook of agile software craftsmanship.', image_url: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=400' },
        { id: 112, title: 'You Dont Know JS', author: 'Kyle Simpson', category: 'Programming', description: 'Diving deep into the core mechanics of JavaScript.', image_url: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=400' },
        { id: 113, title: 'Deep Work', author: 'Cal Newport', category: 'Productivity', description: 'Rules for focused success in a distracted world.', image_url: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&q=80&w=400' },
        { id: 114, title: 'Harry Potter 1', author: 'J.K. Rowling', category: 'Fantasy', description: 'The boy who lived.', image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400' },
        { id: 115, title: 'Steve Jobs', author: 'Walter Isaacson', category: 'Biography', description: 'The biography of the visionary leader of Apple.', image_url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=400' },
        { id: 116, title: 'The Subtle Art', author: 'Mark Manson', category: 'Self-Help', description: 'A counterintuitive approach to living a good life.', image_url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400' },
        { id: 117, title: 'Grit', author: 'Angela Duckworth', category: 'Self-Help', description: 'The power of passion and perseverance.', image_url: 'https://images.unsplash.com/photo-1549122728-6a2707f47d41?auto=format&fit=crop&q=80&w=400' },
        { id: 118, title: 'Bad Blood', author: 'John Carreyrou', category: 'Business', description: 'Secrets and lies in a Silicon Valley startup.', image_url: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=400' },
        { id: 119, title: 'Dune', author: 'Frank Herbert', category: 'Sci-Fi', description: 'A masterpiece of science fiction set on Arrakis.', image_url: 'https://images.unsplash.com/photo-1506466010722-395aa2bef877?auto=format&fit=crop&q=80&w=400' },
        { id: 120, title: 'Start with Why', author: 'Simon Sinek', category: 'Leadership', description: 'How great leaders inspire everyone to take action.', image_url: 'https://images.unsplash.com/photo-1510172951991-856a654063f9?auto=format&fit=crop&q=80&w=400' },
        { id: 121, title: 'The Power of Habit', author: 'Charles Duhigg', category: 'Science', description: 'Why we do what we do in life and business.', image_url: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=400' },
        { id: 122, title: 'Elon Musk', author: 'Ashlee Vance', category: 'Biography', description: 'Tesla, SpaceX, and the quest for a fantastic future.', image_url: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=400' },
        { id: 123, title: 'The Pragmatic Programmer', author: 'Andrew Hunt', category: 'Programming', description: 'Your journey to mastery.', image_url: 'https://images.unsplash.com/photo-1522252234503-e356532cafd5?auto=format&fit=crop&q=80&w=400' },
        { id: 124, title: 'Man Search for Meaning', author: 'Viktor Frankl', category: 'Psychology', description: 'Lessons from the concentration camps.', image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400' },
        { id: 125, title: 'Homo Deus', author: 'Yuval Noah Harari', category: 'Science', description: 'A brief history of tomorrow.', image_url: 'https://images.unsplash.com/photo-1451187530230-b23b99593740?auto=format&fit=crop&q=80&w=400' }
    ];
    // Shuffle and pick top 10 books for massive randomness
    const shuffled = [...externalBooks].sort(() => 0.5 - Math.random());
    res.json(shuffled.slice(0, 10));
});

// Create Book with Image Upload
router.post('/', authMiddleware, adminMiddleware, upload.single('image'), async (req, res) => {
    const { title, author, description, category } = req.body;
    const imageUrl = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : req.body.image_url;

    try {
        const [result] = await db.execute(
            'INSERT INTO books (title, author, description, category, image_url) VALUES (?, ?, ?, ?, ?)',
            [title, author, description, category, imageUrl]
        );
        res.status(201).json({ message: 'Book created', id: result.insertId });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Update Book with Image Upload
router.put('/:id', authMiddleware, adminMiddleware, upload.single('image'), async (req, res) => {
    const { title, author, description, category } = req.body;
    let imageUrl = req.body.image_url;

    if (req.file) {
        imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    try {
        await db.execute(
            'UPDATE books SET title=?, author=?, description=?, category=?, image_url=? WHERE id=?',
            [title, author, description, category, imageUrl, req.params.id]
        );
        res.json({ message: 'Book updated' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Delete Book
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        await db.execute('DELETE FROM books WHERE id = ?', [req.params.id]);
        res.json({ message: 'Book deleted' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
