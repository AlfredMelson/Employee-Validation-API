# Mygom.tech interview task: User management

## How to start

- create a new branch `develop`
- before returning the task create a merge request from `develop` to `master` in your repository, so it's easier to see all the changes

## Setup & Script

- run `yarn`
- run `yarn dev` to start the server on port 9003

## Remaining tasks (18Feb2022)

[ ] Complete administrator validatation
[ ] Setup employee validatation
[ ] Add tests
[ ] Refactor code
[ ] Deepdive type safety

## Feature set

1. Register an administrator
2. Verify administrator's email address
3. Login administrator
4. Get current administrator
5. Logout administrator
6. Handle accessToken
7. Handle refreshToken
8. CRUD employees

## Libraries

- [TypeScript](https://www.typescriptlang.org/) - Static type checking
- [Express@5](https://expressjs.com/en/5x/api.html) - Web server (next)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js#readme) - Hash passwords
- [Express-validator](https://express-validator.github.io/docs/) - Validation
- [Zod](https://github.com/colinhacks/zod) - Validation (testing)
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - JSON webToken signing/verification
- [Pino](https://github.com/pinojs/pino) - Logging
