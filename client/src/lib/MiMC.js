import circomlib from 'circomlib'
import snarkjs from '../lib/snarkjs'

const mimcsponge = circomlib.mimcsponge

const bigInt = snarkjs.bigInt

export default class MimcSpongeHasher {
  constructor() {}

  hash(level, left, right) {
    return mimcsponge.multiHash([bigInt(left), bigInt(right)]).toString()
  }
}
