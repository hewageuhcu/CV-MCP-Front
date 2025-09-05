
# CV-MCP-Front (Frontend)

This folder contains the Next.js 15 frontend for chatting with the MCP server and triggering emails.

---

## Getting Started

### 1. Install dependencies

```sh
npm install
```

### 2. Configure API endpoints

Create a `.env.local` file in this folder with the following content:

```
NEXT_PUBLIC_CHAT_API_URL=http://localhost:5093/api/chat
NEXT_PUBLIC_EMAIL_API_URL=http://localhost:5093/mcp/email/send
```

Adjust the URLs if your backend runs on a different host or port.

### 3. Run the development server

```sh
npm run dev
```

The frontend will be available at [http://localhost:3000](http://localhost:3000)

---

## Usage

- **Chat:** Use the chat UI to send questions to the MCP backend.
- **Email:** Use the email form to send emails via the backend API.

---

## Troubleshooting

- If you see CORS errors, make sure the backend CORS policy allows `http://localhost:3000`.
- If ports are in use, change them in the backend or frontend config.
- For API errors, check backend logs and ensure the payload matches backend expectations.

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

---

## License
See [LICENSE](../LICENSE).
