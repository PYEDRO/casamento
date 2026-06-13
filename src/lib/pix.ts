/**
 * Gerador de BR Code (Pix) estático no padrão EMV® MPM do Banco Central.
 * A chave Pix roteia os fundos diretamente para a conta bancária do recebedor;
 * não há API/PSP envolvida — é o mesmo payload que apps de banco leem.
 *
 * Referência: Manual de Padrões para Iniciação do Pix (Bacen) / EMVCo MPM.
 */

export interface PixParams {
  /** Chave Pix do recebedor (e-mail, CPF/CNPJ, telefone ou chave aleatória). */
  key: string;
  /** Nome do recebedor (máx. 25 chars, ASCII). */
  merchantName: string;
  /** Cidade do recebedor (máx. 15 chars, ASCII). */
  merchantCity: string;
  /** Valor em reais. Omitido => QR sem valor fixo (pagador digita). */
  amount?: number;
  /** Identificador da transação. Padrão "***" (sem txid). */
  txid?: string;
}

/** Monta um campo EMV: ID (2) + tamanho (2, zero-pad) + valor. */
function field(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
}

/** Remove acentos e caracteres fora do conjunto ASCII aceito pelo Pix. */
function sanitize(text: string, maxLen: number): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9 ]/g, '')
    .toUpperCase()
    .trim()
    .slice(0, maxLen);
}

/** CRC16-CCITT (XModem): poly 0x1021, init 0xFFFF. Retorna 4 hex maiúsculos. */
export function crc16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/** Constrói o payload completo do BR Code Pix (copia-e-cola e conteúdo do QR). */
export function buildPixPayload({
  key,
  merchantName,
  merchantCity,
  amount,
  txid = '***',
}: PixParams): string {
  // Tag 26: Merchant Account Information — Pix.
  const merchantAccount = field('26', field('00', 'br.gov.bcb.pix') + field('01', key));

  // Tag 62: Additional Data Field — Reference Label (txid).
  const additionalData = field('62', field('05', txid));

  const payloadSemCrc =
    field('00', '01') + // Payload Format Indicator
    field('01', '11') + // Point of Initiation: estático/reutilizável
    merchantAccount +
    field('52', '0000') + // Merchant Category Code
    field('53', '986') + // Moeda: BRL
    (amount !== undefined ? field('54', amount.toFixed(2)) : '') +
    field('58', 'BR') + // País
    field('59', sanitize(merchantName, 25)) +
    field('60', sanitize(merchantCity, 15)) +
    additionalData +
    '6304'; // ID + len do CRC, valor calculado a seguir

  return payloadSemCrc + crc16(payloadSemCrc);
}
