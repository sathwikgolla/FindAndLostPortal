# API Testing Guide (cURL)

Base URL: `http://localhost:5000`

## 1) Register
```bash
curl -s -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test\",\"email\":\"test@example.com\",\"password\":\"Test123!\"}"
```

## 2) Login
```bash
curl -s -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"user@findandlost.dev\",\"password\":\"User123!\"}"
```

Copy `data.token` as `TOKEN`.

## 3) Browse active items (public)
```bash
curl -s "http://localhost:5000/api/items?page=1&limit=12"
```

## 4) Report lost item (protected)
```bash
curl -s -X POST http://localhost:5000/api/items/lost ^
  -H "Authorization: Bearer TOKEN" ^
  -F "title=Blue backpack" ^
  -F "description=Lost near metro exit" ^
  -F "category=Accessories" ^
  -F "location=Delhi" ^
  -F "date=2026-05-01"
```

## 5) Create claim request (protected)
```bash
curl -s -X POST http://localhost:5000/api/claims/ITEM_ID ^
  -H "Authorization: Bearer TOKEN" ^
  -H "Content-Type: application/json" ^
  -d "{\"message\":\"I believe this is mine\",\"proofDetails\":\"Unique mark on the inside pocket\"}"
```

