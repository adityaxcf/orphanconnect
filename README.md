# OrphanConnect 🏠

> 📚 Built as a 4th Semester Software Engineering (SE) and Web Technologies (WT) project.

A full-stack MERN web platform to connect orphanages in Hubli, Karnataka with donors, volunteers, and adoptive parents.

## Features
- 🏠 Browse orphanages in Hubli with details, facilities and location
- 💰 Donate money (via Razorpay) or items like food, clothes, books
- 🤝 Volunteer at orphanages
- 👶 Adopt a child (with admin approval flow)
- 🎫 Track all your requests via My Tickets
- 👤 Owner dashboard to manage incoming requests and edit orphanage details
- 🔐 Admin dashboard to approve orphanages, view all users and tickets

## Tech Stack
- **Frontend:** React.js (Vite)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Payment:** Razorpay
- **Auth:** JWT


## Local setup

1. Install backend dependencies: `cd backend && npm install`.
2. Copy `backend/.env.example` to `backend/.env` and fill in MongoDB and Razorpay credentials.
3. Generate a bcrypt password hash for the admin account from the backend directory:
   `node -e "require('bcryptjs').hash('YOUR_STRONG_PASSWORD', 12).then(console.log)"`
4. Set `ADMIN_EMAIL` and the generated `ADMIN_PASSWORD_HASH` in `backend/.env`. The admin password is never stored in source code.
5. Set a random `JWT_SECRET` of at least 32 characters.
6. For the frontend, copy `frontend/.env.example` to `frontend/.env` and set the public Razorpay key ID.

Never commit `.env` files or expose `RAZORPAY_KEY_SECRET` or `JWT_SECRET` to the frontend. If any real credentials were previously committed, rotate them in their respective provider dashboards; deleting a file does not remove it from Git history.

## Security notes

The payment order endpoint currently accepts an amount from the authenticated client's request. Before using live payments, change this flow so the server calculates the amount from a trusted donation record and validates the donation state; client-supplied amounts must not be treated as authoritative.
