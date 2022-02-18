import jwt from 'jsonwebtoken'

export const createJwtAccessToken = (admin: string) =>
  jwt.sign(
    // first: payload will be the foundAdmin username object
    { username: admin },

    // second: access secret defined in .env
    // process.env.ACCESS_TOKEN_SECRET,
    '49d602b423a56b281168f50b58d444af414c819ee9d75ff674e6668361123626fc4a67a07e859d76fee75c1fd7c7071b1d28bc798f6e47835d72f8e48ab77972',

    // third: options value for expiration (Production ~10 mins)
    { expiresIn: '1d' }
  )

export const createJwtRefreshToken = (admin: string) =>
  jwt.sign(
    // first: payload will be the foundAdmin username object
    { username: admin },

    // second: refresh secret defined in .env
    // process.env.REFRESH_TOKEN_SECRET,
    'a97a6109f424c526929b5ea4d2a9d17bf36ff15f5f7a610df6f0cad5fdaa58d670a184287054620245017ce1ff5f22c79ee21ef016e6b586e62e6ace5aa73040',

    // third: options value for expiration
    { expiresIn: '1d' }
  )
