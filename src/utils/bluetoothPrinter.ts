import { Transaction, StoreConfig } from '../types';
import { formatCurrency } from './format';

// Declaration for Web Bluetooth API in TypeScript
declare global {
  interface Navigator {
    bluetooth?: {
      requestDevice(options: {
        acceptAllDevices?: boolean;
        filters?: Array<{ services?: string[]; name?: string; namePrefix?: string }>;
        optionalServices?: string[];
      }): Promise<BluetoothDevice>;
    };
  }

  interface BluetoothDevice {
    id: string;
    name?: string;
    gatt?: BluetoothRemoteGATTServer;
  }

  interface BluetoothRemoteGATTServer {
    connected: boolean;
    connect(): Promise<BluetoothRemoteGATTServer>;
    disconnect(): void;
    getPrimaryService(service: string | number): Promise<BluetoothRemoteGATTService>;
  }

  interface BluetoothRemoteGATTService {
    getCharacteristic(characteristic: string | number): Promise<BluetoothRemoteGATTCharacteristic>;
  }

  interface BluetoothRemoteGATTCharacteristic {
    writeValue(value: BufferSource): Promise<void>;
  }
}

// Global cached bluetooth device reference
let cachedDevice: BluetoothDevice | null = null;
let cachedCharacteristic: BluetoothRemoteGATTCharacteristic | null = null;

export const isWebBluetoothSupported = (): boolean => {
  return typeof navigator !== 'undefined' && 'bluetooth' in navigator && !!navigator.bluetooth;
};

// Formats string to ESC/POS thermal text commands
export const buildEscPosBuffer = (
  transaction: Transaction,
  storeConfig: StoreConfig
): Uint8Array => {
  const encoder = new TextEncoder();
  const bytes: number[] = [];

  // Helper functions for ESC/POS commands
  const INIT = [0x1b, 0x40]; // ESC @ (Initialize printer)
  const CENTER = [0x1b, 0x61, 0x01]; // ESC a 1 (Align center)
  const LEFT = [0x1b, 0x61, 0x00]; // ESC a 0 (Align left)
  const BOLD_ON = [0x1b, 0x45, 0x01]; // ESC E 1
  const BOLD_OFF = [0x1b, 0x45, 0x00]; // ESC E 0
  const DOUBLE_HEIGHT_ON = [0x1b, 0x21, 0x10]; // ESC ! 16
  const NORMAL_TEXT = [0x1b, 0x21, 0x00]; // ESC ! 0
  const FEED_LINE = [0x0a];

  const pushArray = (arr: number[]) => {
    bytes.push(...arr);
  };

  const pushText = (text: string) => {
    const encoded = encoder.encode(text);
    for (let i = 0; i < encoded.length; i++) {
      bytes.push(encoded[i]);
    }
  };

  const pushLine = (text: string = '') => {
    if (text) pushText(text);
    pushArray(FEED_LINE);
  };

  const curr = storeConfig.currencySymbol || 'Rp';
  const width = 32; // Standard 58mm width (32 chars per line)

  const formatLineTwoCols = (left: string, right: string): string => {
    const spaceCount = width - left.length - right.length;
    if (spaceCount <= 0) {
      return left.substring(0, width - right.length - 1) + ' ' + right;
    }
    return left + ' '.repeat(spaceCount) + right;
  };

  // 1. Initialize
  pushArray(INIT);

  // 2. Header (Centered)
  pushArray(CENTER);
  pushArray(BOLD_ON);
  pushArray(DOUBLE_HEIGHT_ON);
  pushLine(storeConfig.storeName.toUpperCase());
  pushArray(NORMAL_TEXT);
  pushArray(BOLD_OFF);

  if (storeConfig.storeBranch) pushLine(storeConfig.storeBranch);
  if (storeConfig.address) pushLine(storeConfig.address);
  if (storeConfig.phone) pushLine(`Telp: ${storeConfig.phone}`);
  pushLine('--------------------------------');

  // 3. Ticket & Metadata (Left Aligned)
  pushArray(LEFT);
  pushLine(`No. Tiket : ${transaction.ticketNo}`);
  pushLine(`Waktu     : ${transaction.date} ${transaction.time}`);
  pushLine(`Kasir     : ${transaction.cashierName}`);
  if (transaction.customerName) {
    pushLine(`Pelanggan : ${transaction.customerName}`);
  }
  pushLine(`Metode    : ${transaction.paymentMethod}`);
  pushLine('================================');

  // 4. Item List
  transaction.items.forEach((item) => {
    pushArray(BOLD_ON);
    pushLine(item.productName);
    pushArray(BOLD_OFF);

    const qtyPrice = `${item.quantity} x ${formatCurrency(item.unitPrice, curr)}`;
    const itemSubtotal = formatCurrency(item.subtotal, curr);
    pushLine(formatLineTwoCols(`  ${qtyPrice}`, itemSubtotal));
  });

  pushLine('--------------------------------');

  // 5. Totals
  pushLine(formatLineTwoCols('Subtotal:', formatCurrency(transaction.subtotal, curr)));

  if (transaction.discount > 0) {
    pushLine(formatLineTwoCols('Diskon:', `-${formatCurrency(transaction.discount, curr)}`));
  }

  pushLine(formatLineTwoCols(`Pajak (${(storeConfig.taxRate * 100).toFixed(1)}%):`, formatCurrency(transaction.tax, curr)));

  pushArray(BOLD_ON);
  pushLine(formatLineTwoCols('TOTAL:', formatCurrency(transaction.total, curr)));
  pushArray(BOLD_OFF);

  if (transaction.amountTendered !== undefined && transaction.amountTendered > 0) {
    pushLine(formatLineTwoCols('Diterima:', formatCurrency(transaction.amountTendered, curr)));
  }

  if (transaction.changeDue !== undefined && transaction.changeDue >= 0) {
    pushLine(formatLineTwoCols('Kembalian:', formatCurrency(transaction.changeDue, curr)));
  }

  pushLine('--------------------------------');

  // 6. Footer (Centered)
  pushArray(CENTER);
  if (storeConfig.receiptFooter) {
    pushLine(storeConfig.receiptFooter);
  }
  pushLine('Terima Kasih atas Kunjungan Anda');
  pushLine('');
  pushLine('');
  pushLine('');
  pushArray(FEED_LINE);

  return new Uint8Array(bytes);
};

// Connects to Bluetooth printer & sends data
export const printViaWebBluetooth = async (
  transaction: Transaction,
  storeConfig: StoreConfig
): Promise<{ success: boolean; deviceName?: string; error?: string }> => {
  if (!isWebBluetoothSupported()) {
    return {
      success: false,
      error: 'Web Bluetooth API tidak didukung di browser ini. Gunakan Google Chrome / Microsoft Edge.'
    };
  }

  try {
    let device = cachedDevice;
    let characteristic = cachedCharacteristic;

    // Request device if not cached or disconnected
    if (!device || !device.gatt?.connected || !characteristic) {
      device = await navigator.bluetooth!.requestDevice({
        acceptAllDevices: true,
        optionalServices: [
          '000018f0-0000-1000-8000-00805f9b34fb', // Standard Serial / Thermal Service
          'e7810a71-73ae-499d-8c15-faa9aef0c3f2',
          '49535343-fe7d-4ae5-8fa9-9fafd205e455'
        ]
      });

      cachedDevice = device;

      const server = await device.gatt!.connect();

      // Find primary service
      let service: BluetoothRemoteGATTService | null = null;
      const serviceUUIDs = [
        '000018f0-0000-1000-8000-00805f9b34fb',
        'e7810a71-73ae-499d-8c15-faa9aef0c3f2',
        '49535343-fe7d-4ae5-8fa9-9fafd205e455'
      ];

      for (const uuid of serviceUUIDs) {
        try {
          service = await server.getPrimaryService(uuid);
          if (service) break;
        } catch {
          // Continue trying next UUID
        }
      }

      if (!service) {
        throw new Error('Layanan printer thermal tidak ditemukan pada perangkat Bluetooth ini.');
      }

      // Find write characteristic
      const charUUIDs = [
        '00002af1-0000-1000-8000-00805f9b34fb',
        'bef8d6c9-9c21-4c9e-b632-bd58c1009f9f',
        '49535343-8841-43f4-a8d4-ecbe34729bb3'
      ];

      for (const uuid of charUUIDs) {
        try {
          characteristic = await service.getCharacteristic(uuid);
          if (characteristic) break;
        } catch {
          // Continue
        }
      }

      if (!characteristic) {
        throw new Error('Karakteristik penulisan data printer tidak ditemukan.');
      }

      cachedCharacteristic = characteristic;
    }

    // Build binary buffer
    const buffer = buildEscPosBuffer(transaction, storeConfig);

    // Send data in chunks of 512 bytes to prevent Bluetooth packet overflow
    const chunkSize = 512;
    for (let i = 0; i < buffer.length; i += chunkSize) {
      const chunk = buffer.slice(i, i + chunkSize);
      await characteristic.writeValue(chunk);
    }

    return {
      success: true,
      deviceName: device.name || 'Printer Bluetooth'
    };
  } catch (err: any) {
    // Reset cache if error occurred
    cachedDevice = null;
    cachedCharacteristic = null;
    return {
      success: false,
      error: err?.message || 'Gagal terhubung ke printer Bluetooth.'
    };
  }
};
