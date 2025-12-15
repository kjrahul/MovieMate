MovieMate

Setup Steps


1. Clone the Repository

###git clone https://github.com/your-username/MovieMate.git

cd MovieMate

2. Backend Setup

cd MovieMate_Backend

python -m venv venv
source venv/binactivate    # Windows: venv\Scripts\activate
pip install -r requirements.txt

Create a .env file:
TMDB_API_KEY=your_tmdb_api_key
DATABASE_URL=sqlite:///moviemate.db

Run the backend server:
uvicorn app.main:app --reload

Backend URL:
http://127.0.0.1:8000

3. Frontend Setup

cd MovieMate_Frontend

npm install
npm run dev

Frontend URL:
http://localhost:5173

🚀 Feature List

Add and manage movies and TV shows

Search movies and TV shows using TMDB API

Auto-fetch content details 

Track content status: Watching, Completed, Wishlist

Episode tracking for TV series

content recommendations

Responsive and modern UI

