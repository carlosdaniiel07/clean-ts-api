import { sign, verify } from 'jsonwebtoken'
import { Decrypter } from '../../data/protocols/cryptography/decrypter'
import { TokenGenerator } from '../../data/protocols/cryptography/token-generator'
import { AccountModel } from '../../domain/models/account'
import config from '../../main/config/env'

export class JwtAdapter implements TokenGenerator, Decrypter {
  generate (account: AccountModel): string {
    const { name, email } = account
    const token = sign({ name, email }, config.JWT_SECRET_KEY, {
      issuer: 'clean-ts-api',
      audience: 'clean-ts-app',
      expiresIn: '6h',
      subject: email
    })

    return token
  }

  async decrypt (value: string): Promise<string | null> {
    const payload = verify(value, config.JWT_SECRET_KEY)
    return await Promise.resolve(String(payload))
  }
}
