
import React, { useEffect, useRef } from 'react';
import Quagga from 'quagga';
import { Barcode, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface BarcodeScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (barcode: string) => void;
}

export const BarcodeScanner = ({ isOpen, onClose, onScan }: BarcodeScannerProps) => {
  const scannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && scannerRef.current) {
      Quagga.init({
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: scannerRef.current,
          constraints: {
            facingMode: "environment"
          },
        },
        decoder: {
          readers: ["ean_reader", "ean_8_reader", "upc_reader", "upc_e_reader"]
        }
      }, (err) => {
        if (err) {
          console.error("Failed to initialize scanner:", err);
          return;
        }
        Quagga.start();
      });

      Quagga.onDetected((result) => {
        if (result.codeResult.code) {
          onScan(result.codeResult.code);
          onClose();
        }
      });

      return () => {
        Quagga.stop();
      };
    }
  }, [isOpen, onScan, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Scan Barcode</DialogTitle>
        </DialogHeader>
        <div ref={scannerRef} className="relative w-full h-64 bg-black">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-1 bg-red-500 opacity-50" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
