export async function downloadPrescriptionPdfFile(downloadFn, id, fileName) {
  const res = await downloadFn(id);
  const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName || `prescription-${id}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export async function printPrescriptionPdf(downloadFn, id) {
  const res = await downloadFn(id);
  const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
  const printWindow = window.open(url);
  if (printWindow) {
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  } else {
    window.URL.revokeObjectURL(url);
    throw new Error('Popup blocked. Please allow popups to print.');
  }
}
