import { app } from "./app.js";

const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
    console.log(`Server is running: http://localhost:${PORT}/health`);
});