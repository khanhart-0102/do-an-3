import QRCode from "qrcode";

export interface BankTransferConfig {
  bankBin: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export function getBankTransferConfig(): BankTransferConfig | null {
  const bankBin = process.env.PAYMENT_BANK_BIN?.trim();
  const bankName = process.env.PAYMENT_BANK_NAME?.trim();
  const accountNumber = process.env.PAYMENT_ACCOUNT_NUMBER?.trim();
  const accountName = process.env.PAYMENT_ACCOUNT_NAME?.trim();

  if (!bankBin && !bankName && !accountNumber && !accountName) {
    return null;
  }
  if (!bankBin || !bankName || !accountNumber || !accountName) {
    throw new Error("Incomplete bank transfer configuration");
  }

  if (!/^\d{6}$/.test(bankBin) || !/^\d{6,24}$/.test(accountNumber)) {
    throw new Error("Invalid bank transfer configuration");
  }

  return { bankBin, bankName, accountNumber, accountName };
}

function field(id: string, value: string): string {
  return `${id}${Buffer.byteLength(value, "utf8").toString().padStart(2, "0")}${value}`;
}

function crc16(payload: string): string {
  let crc = 0xffff;
  for (const byte of Buffer.from(payload, "utf8")) {
    crc ^= byte << 8;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc & 0x8000) !== 0 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

export async function createVietQrDataUrl(
  config: BankTransferConfig,
  amount: number,
  reference: string
): Promise<string> {
  const merchantAccount = [
    field("00", "A000000727"),
    field("01", config.bankBin),
    field("02", config.accountNumber),
    field("03", "QRIBFTTA"),
  ].join("");
  const additionalData = field("08", reference);
  const payloadWithoutCrc = [
    field("00", "01"),
    field("01", "12"),
    field("38", merchantAccount),
    field("53", "704"),
    field("54", String(amount)),
    field("58", "VN"),
    field("62", additionalData),
    "6304",
  ].join("");
  const payload = `${payloadWithoutCrc}${crc16(payloadWithoutCrc)}`;

  return QRCode.toDataURL(payload, {
    errorCorrectionLevel: "M",
    margin: 2,
    width: 280,
  });
}
