import { Encrypter } from '../../data/protocols/encrypter'
import bcrypt from 'bcrypt'

export class BCryptAdapter implements Encrypter {
  async encrypt (value: string): Promise<string> {
    return await bcrypt.hash(value, 12)
  }
}
