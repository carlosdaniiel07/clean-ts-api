import { Encrypter } from '../../data/protocols/encrypter'
import bcrypt from 'bcrypt'
import { HashComparer } from '../../data/protocols/hash'

export class BCryptAdapter implements Encrypter, HashComparer {
  constructor (private readonly salt: number) {}

  async encrypt (value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt)
  }

  async compare (plainText: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(plainText, hash)
  }
}
