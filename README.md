# User management backend

## Setup & Script

- run `yarn`
- run `yarn dev` to start the server on port 9003
- web (reactjs) located in seperate repo: https://github.com/AlfredMelson/registrant_validation_web

## Current tasks (4March2022)

[ ] Add server side validation to Employee CRUD
[ ] Add tests
[ ] Refactor as needed

## Feature set

1. Administrator registration/login/logout
2. Persistent authentication with JWT Tokens
3. Authentication secured without localStorage or sessionStorage
4. CRUD employees

## Libraries

- [TypeScript](https://www.typescriptlang.org/) - Static type checking
- [Express@5](https://expressjs.com/en/5x/api.html) - Web server (next)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js#readme) - Hash passwords
- [Express-validator](https://express-validator.github.io/docs/) - Validation
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - JSON webToken signing/verification
- [Zod](https://github.com/colinhacks/zod) - Validation (testing)
