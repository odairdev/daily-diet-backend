import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'
import { z } from 'zod'

interface User {
  id: string;
  name: string
}

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

  app.get('/:id', async (request, response) => {
    const getUserParamsSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = getUserParamsSchema.parse(request.params)

    const user: User = await knex('users').where({
      id
    }). first()

    if(!user) {
      return response.status(404).send({ message: 'User not found'})
    }

    response.cookie('userId', user.id, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7days
    })

    return response.status(200).send()

  })
}