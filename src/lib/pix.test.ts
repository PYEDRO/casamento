import { describe, it, expect } from 'vitest';
import { crc16, buildPixPayload } from './pix';

describe('crc16 (CCITT/XModem)', () => {
  // Vetor de teste clássico: CRC16-CCITT-FALSE de "123456789" = 0x29B1.
  it('calcula o CRC do vetor de referência', () => {
    expect(crc16('123456789')).toBe('29B1');
  });
});

describe('buildPixPayload', () => {
  const payload = buildPixPayload({
    key: 'ana.carlos.casamento@gmail.com',
    merchantName: 'ANA SILVA',
    merchantCity: 'SAO PAULO',
    amount: 100,
    txid: 'PRESENTE01',
  });

  it('começa com o Payload Format Indicator', () => {
    expect(payload.startsWith('000201')).toBe(true);
  });

  it('inclui o GUI do Pix e a chave', () => {
    expect(payload).toContain('br.gov.bcb.pix');
    expect(payload).toContain('ana.carlos.casamento@gmail.com');
  });

  it('formata o valor com 2 casas (tag 54)', () => {
    expect(payload).toContain('5406100.00');
  });

  it('termina com CRC válido e auto-consistente', () => {
    const semCrc = payload.slice(0, -4);
    expect(payload.slice(-4)).toBe(crc16(semCrc));
    expect(payload.slice(-8, -4)).toBe('6304');
  });
});
