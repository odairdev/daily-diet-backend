import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { checkUserIdExists } from '../middleware/checkUserIdExists'
import { randomUUID } from 'node:crypto'

export async function MeaslRoutes(app: FastifyInstance) {
  app.get('/', {
    preHandler: checkUserIdExists
  }, async (request, response) => {
    const { userId } = request.cookies

    return await knex('meals').where({
      userId
    })
  })

  app.get('/:id', {
    preHandler: checkUserIdExists
  }, async (request, response) => {
    const { userId } = request.cookies

    const getMealIdSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = getMealIdSchema.parse(request.params)

    if(!id) {
      return response.status(404).send({ error: 'Meal not found.'})
    }

    const meal = await knex('meals').where({
      id,
      userId
    }).first()

    if(!meal) {
      return response.status(404).send({ error: 'Meal not found.'})
    }

    return meal


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

  app.put('/:id', {
    preHandler: checkUserIdExists
  }, async (request, response) => {
    const { userId } = request.cookies

    // @ts-ignore
    const { id } = request.params

    const getMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      diet: z.boolean()
    })

    const { name, description, diet } = getMealBodySchema.parse(request.body)

    const updatedMeal = await knex('meals').where({
      id,
      userId
    }).update({
      name,
      description,
      diet
    })

    if(!updatedMeal) {
      return response.status(404).send({ error: 'Meal not found.'})
    }

    return response.status(201).send({ message: 'Meal updated.'})
  })

  app.delete('/:id', {
    preHandler: checkUserIdExists
  }, async (request, response) => {
    const { userId } = request.cookies

    //@ts-ignore
    const { id } = request.params

    const deletedMeal = await knex('meals').where({
      id,
      userId
    }).delete()

    if(!deletedMeal) {
      return response.status(404).send({error: 'Meal not found.'})
    }

    return response.send({message: 'Meal deleted successfully.'})
  })

}