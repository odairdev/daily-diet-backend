import { FastifyInstance } from 'fastify'

export async function MeaslRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    return 'meals'
  })
}