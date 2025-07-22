import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import QRCode from 'react-qr-code';
import { Peermall } from '@/types/peermall';

interface QRCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  peermall: Peermall | null;
}

const QRCodeDialog = ({ open, onOpenChange, peermall }: QRCodeDialogProps) => {
  if (!peermall) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{peermall.name} QR 코드</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4 py-4">
          <div className="bg-white p-4 rounded-lg">
            <QRCode
              value={`${window.location.origin}/home/${peermall.url}`}
              size={200}
            />
          </div>
          <p className="text-sm text-muted-foreground text-center">
            QR 코드를 스캔하여 피어몰에 접속하세요
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeDialog;
