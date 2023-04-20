import { FastifyRequest, FastifyReply } from 'fastify'
import { knex } from '../database'

export async function checkUserIdExists(request: FastifyRequest, response: FastifyReply) {
  const { userId } = request.cookies

  if(!userId) {
    return response.status(401).send({
      error: 'Unauthorized: No user selected.'
    })
  }

  const userExists = await knex('users').where({
    id: userId
  }).first()

  if(!userExists) {
    return response.status(404).send({
      error: 'User not found.'
    })
  }
}