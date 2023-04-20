import fastify from "fastify";
import cookie from "@fastify/cookie"
import { MeaslRoutes } from "./routes/meals";
import { UserRoutes } from "./routes/users";

const app = fastify()

app.register(cookie)


app.register(UserRoutes, {
  prefix: '/users'
})
app.register(MeaslRoutes, {
  prefix: '/meals'
})

export { app }