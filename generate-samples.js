const fs = require('fs');
const PDFDocument = require('pdfkit');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun } = require('docx');

async function createFiles() {
  try {
    // Fetch an image buffer
    console.log("Mengambil gambar placeholder...");
    const imgUrl = 'https://dummyimage.com/200x200/111844/fff.png&text=DockSidz+Test';
    const res = await fetch(imgUrl);
    const imgBuffer = Buffer.from(await res.arrayBuffer());

    // 1. Create PDF
    console.log("Membuat sample_test.pdf...");
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream('./public/sample_test.pdf'));
    
    doc.fontSize(24).font('Helvetica-Bold').text('DockSidz Uji Coba PDF', { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(12).font('Helvetica').text('Ini adalah paragraf pertama dalam file sampel uji coba DockSidz. File ini dibuat secara otomatis menggunakan Node.js untuk keperluan pengujian alat dokumen seperti Konversi, Pratinjau, dan lain-lain. Teks ini harusnya terbaca dengan jelas saat diubah ke Word atau dipratinjau.', { align: 'justify' });
    doc.moveDown();
    
    // Posisi x untuk memusatkan gambar 200x200 (kertas A4 lebar 595.28)
    doc.image(imgBuffer, 197, doc.y, { width: 200, height: 200 });
    doc.moveDown(15);
    
    doc.font('Helvetica-Bold').text('Tabel Data Sampel (Simulasi):', { underline: true });
    doc.moveDown(0.5);
    
    doc.font('Helvetica').text('Kolom 1       | Kolom 2       | Kolom 3');
    doc.text('---------------------------------------');
    doc.text('Baris 1 A     | Baris 1 B     | Baris 1 C');
    doc.text('Baris 2 A     | Baris 2 B     | Baris 2 C');
    
    doc.end();

    // 2. Create DOCX
    console.log("Membuat sample_test.docx...");
    const docx = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [new TextRun({ text: "DockSidz Uji Coba Word", bold: true, size: 48 })],
          }),
          new Paragraph({
            children: [new TextRun({ text: "Ini adalah paragraf pertama dalam file sampel uji coba DockSidz. File ini dibuat secara otomatis menggunakan Node.js untuk keperluan pengujian alat dokumen seperti Konversi, Pratinjau, dan lain-lain. Teks ini harusnya terbaca dengan jelas saat diubah ke PDF atau dipratinjau." })],
          }),
          new Paragraph({
            children: [
              new ImageRun({
                data: imgBuffer,
                transformation: { width: 200, height: 200 },
              })
            ]
          }),
          new Paragraph({
            children: [new TextRun({ text: "Tabel Data Sampel", bold: true })],
          }),
          new Table({
            rows: [
              new TableRow({ children: [new TableCell({ children: [new Paragraph("Kolom 1")] }), new TableCell({ children: [new Paragraph("Kolom 2")] }), new TableCell({ children: [new Paragraph("Kolom 3")] })] }),
              new TableRow({ children: [new TableCell({ children: [new Paragraph("Baris 1 A")] }), new TableCell({ children: [new Paragraph("Baris 1 B")] }), new TableCell({ children: [new Paragraph("Baris 1 C")] })] }),
              new TableRow({ children: [new TableCell({ children: [new Paragraph("Baris 2 A")] }), new TableCell({ children: [new Paragraph("Baris 2 B")] }), new TableCell({ children: [new Paragraph("Baris 2 C")] })] }),
            ]
          })
        ]
      }]
    });
    
    const b64string = await Packer.toBuffer(docx);
    fs.writeFileSync('./public/sample_test.docx', b64string);
    console.log("Selesai! File disimpan di folder public/.");
  } catch (error) {
    console.error("Gagal membuat sampel:", error);
  }
}

createFiles();
