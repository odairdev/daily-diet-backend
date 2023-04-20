import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { checkUserIdExists } from '../middleware/checkUserIdExists'
import { randomUUID } from 'node:crypto'

export async function MeaslRoutes(app: FastifyInstance) {
  app.get('/', {
    preHandler: checkUserIdExists
  }, async () => {
    return await knex('meals').select()
  })

  app.post('/', {
    preHandler: checkUserIdExists
  } , async (request, response) => {
    const createMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      diet: z.boolean()
    })

    const { name, description, diet } = createMealBodySchema.parse(request.body)

    const { userId } = request.cookies

    await knex('meals').insert({
      id: randomUUID(),
      userId,
      name,
      description,
      diet
    })

    return response.status(201).send({
      message: 'Meal added successfully.'
    })
  })
}