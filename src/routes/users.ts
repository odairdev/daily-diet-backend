import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'
import { z } from 'zod'

export async function UserRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    return knex('users').select()
  })

  app.post('/', async (request, response) => {
    const createUserBodySchema = z.object({
      name: z.string()
    })

    const { name } = createUserBodySchema.parse(request.body)

    await knex('users').insert({
      id: randomUUID(),
      name
    })

    return response.status(201).send({ message: 'User created succesfully, please choose an user before adding meals.'})
  })
}