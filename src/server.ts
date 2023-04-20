import { app } from "./app";

app.listen({
  port: 3333
}).then(() => {
  console.log("🖥️ HTTP daily diet server running.")
})