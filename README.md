## Description
Welcome to the Skills Showcase App, a powerful tool developed to present my skills and expertise to potential employers. This application serves as a comprehensive library management system, demonstrating my proficiency in backend development using Nest.js, TypeScript, PostgreSQL, TypeORM, and migration strategies.

## Features
#### User Management
The app provides a robust user management system, allowing for the creation and management of different user roles. Each user is assigned a specific role, defining their permissions within the application.
**User Roles:**
- Admin
- Author

#### Book Management
Efficiently manage and organize a collection of books, authors, and their connections. Showcase my skills in data modeling, relational database design, and backend development.

#### Database Integration
Utilizing PostgreSQL as the database backend, the app seamlessly integrates with TypeORM for efficient database querying and manipulation. Migrations are employed to version control and manage database schema changes.

## Installation

```bash
$ cp .env.example .env

$ nvm use
$ pnpm install

$ pnpm docker:start
$ pnpm migration:run
```

## Running the app

```bash
# development
$ pnpm start

# watch mode
$ pnpm start:dev

# production mode
$ pnpm start:prod
```

## Test

```bash
# unit tests
$ pnpm test

# e2e tests
$ pnpm test:e2e

# test coverage
$ pnpm test:cov
```

## Migrations
```bash
# generate new migraion
$ npm run migration:generate --name=migration-name
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Sonja Mujacic](mailto:sonja.mujacic@gmail.com)

## License

Nest is [MIT licensed](LICENSE).
