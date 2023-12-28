export const UsersResponse = {
  badRequest: {
    status: 400,
    description: 'Bad Request',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'array',
          items: {
            type: 'string',
            example: 'This is not valid email address',
          },
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  },
};
