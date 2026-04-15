"use client";

import { useTransition } from "react";
import { FileText, Loader2 } from "lucide-react";
import { generateInvoiceAction } from "@/actions/invoice.actions";
import { useToast } from "@/lib/store/ToastContext";

interface Props {
  orderId: string;
}

export function DownloadInvoiceBtn({ orderId }: Props) {
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  const handleDownload = () => {
    startTransition(async () => {
      const result = await generateInvoiceAction(orderId);
      
      if (result.success && result.data) {
        const { filename, content } = result.data;
        
        // Convert base64 to blob
        const blob = await (await fetch(`data:text/plain;base64,${content}`)).blob();
        const url = window.URL.createObjectURL(blob);
        
        // Trigger download
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        showToast("Factura descargada", "success");
      } else {
        showToast(result.error || "Error al descargar", "error");
      }
    });
  };

  return (
    <button 
      onClick={handleDownload} 
      className="btn-download" 
      disabled={isPending}
      title="Descargar Factura"
    >
      {isPending ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
      <span>Factura</span>
    </button>
  );
}
