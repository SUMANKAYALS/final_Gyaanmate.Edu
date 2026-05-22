import PDFDocument from 'pdfkit';

export function generateReceiptPDF(payment) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(22).fillColor('#6366f1').text('Gyaanmate', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(14).fillColor('#333').text('Payment Receipt', { align: 'center' });
    doc.moveDown(1.5);

    doc.fontSize(11).fillColor('#444');
    const rows = [
      ['Payment ID', payment.paymentId],
      ['Course', payment.courseName],
      ['Student', payment.studentName],
      ['Instructor', payment.instructorName],
      ['Date', new Date(payment.createdAt).toLocaleString()],
      ['Amount Paid', `$${payment.amount.toFixed(2)}`],
      ['Status', payment.status],
    ];

    rows.forEach(([label, value]) => {
      doc.font('Helvetica-Bold').text(`${label}: `, { continued: true });
      doc.font('Helvetica').text(String(value));
      doc.moveDown(0.4);
    });

    doc.moveDown(2);
    doc.fontSize(9).fillColor('#888').text('Thank you for learning with Gyaanmate!', { align: 'center' });

    doc.end();
  });
}

export function generateCertificatePDF({ courseTitle, studentName, instructorName, completedAt, certificateId }) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#0f172a');
    doc.fillColor('#fff').fontSize(28).font('Helvetica-Bold').text('Certificate of Completion', {
      align: 'center',
      continued: false,
    });

    doc.moveDown(1.2);
    doc.fillColor('#94a3b8').fontSize(12).font('Helvetica').text('This certifies that', { align: 'center' });
    doc.moveDown(0.8);

    doc.fontSize(24).fillColor('#f8fafc').font('Helvetica-Bold').text(studentName, { align: 'center' });
    doc.moveDown(0.8);

    doc.fontSize(12).fillColor('#cbd5e1').font('Helvetica').text('has successfully completed the course', { align: 'center' });
    doc.moveDown(0.8);

    doc.fontSize(20).fillColor('#e2e8f0').font('Helvetica-Bold').text(courseTitle, {
      align: 'center',
      underline: true,
    });

    doc.moveDown(1.5);
    doc.fontSize(12).fillColor('#cbd5e1').font('Helvetica').text(`Instructor: ${instructorName}`, { align: 'center' });
    doc.moveDown(0.5);
    doc.text(`Date: ${new Date(completedAt).toLocaleDateString()}`, { align: 'center' });
    doc.moveDown(0.5);
    doc.text(`Certificate ID: ${certificateId}`, { align: 'center' });

    doc.moveDown(2);
    doc.fontSize(10).fillColor('#94a3b8').text('Issued by LearnHub', { align: 'center' });

    doc.end();
  });
}
