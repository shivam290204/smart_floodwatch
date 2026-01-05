import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Generate Daily Situation Report (DSR) PDF
 * Used by Delhi Government officials (JEs and SDMs) for official flood management records
 */
export const generateDailyReport = () => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Constants
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // ==================== WATERMARK ====================
  pdf.setFont('Arial', 'normal');
  pdf.setTextColor(200, 200, 200); // Light gray
  pdf.setFontSize(60);
  pdf.text('CONFIDENTIAL', pageWidth / 2, pageHeight / 2, {
    align: 'center',
    angle: 45,
    opacity: 0.15
  });

  // Reset text color to black
  pdf.setTextColor(0, 0, 0);

  // ==================== HEADER ====================
  // Top Left: Organization name
  pdf.setFont('Arial', 'bold');
  pdf.setFontSize(12);
  pdf.text('MUNICIPAL CORPORATION OF DELHI', margin, yPosition);

  // Top Right: Date and Time
  const currentDate = new Date();
  const dateStr = currentDate.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  const timeStr = currentDate.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  pdf.setFontSize(10);
  const dateTimeX = pageWidth - margin;
  pdf.text(`Date: ${dateStr}`, dateTimeX, yPosition, { align: 'right' });
  pdf.text(`Time: ${timeStr}`, dateTimeX, yPosition + 6, { align: 'right' });

  yPosition += 15;

  // ==================== MAIN TITLE ====================
  pdf.setFont('Arial', 'bold');
  pdf.setFontSize(14);
  pdf.text('DAILY FLOOD SITUATION REPORT (DSR)', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 12;

  // Divider line
  pdf.setDrawColor(0, 0, 0);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 8;

  // ==================== EXECUTIVE SUMMARY ====================
  pdf.setFont('Arial', 'bold');
  pdf.setFontSize(11);
  pdf.text('EXECUTIVE SUMMARY', margin, yPosition);
  yPosition += 8;

  pdf.setFont('Arial', 'normal');
  pdf.setFontSize(10);

  // Mock data for summary
  const mockData = {
    avgRainfall: 152.4,
    criticalWards: 8,
    teamDeployed: 15,
    activeComplaints: 47,
    pumpStations: 7,
    utilizationRate: 85
  };

  const summaryItems = [
    `• Total Average Rainfall (24h): ${mockData.avgRainfall} mm`,
    `• Active Critical Wards: ${mockData.criticalWards}`,
    `• Response Teams Deployed: ${mockData.teamDeployed}`,
    `• Active Complaints Received: ${mockData.activeComplaints}`,
    `• Pump Stations Operational: ${mockData.pumpStations}`,
    `• System Utilization Rate: ${mockData.utilizationRate}%`
  ];

  summaryItems.forEach(item => {
    pdf.text(item, margin + 5, yPosition);
    yPosition += 6;
  });

  yPosition += 6;

  // ==================== WARD STATUS TABLE ====================
  pdf.setFont('Arial', 'bold');
  pdf.setFontSize(11);
  pdf.text('WARD STATUS & RISK ASSESSMENT', margin, yPosition);
  yPosition += 8;

  // Dummy ward data
  const wardData = [
    {
      wardId: 'W-001',
      location: 'Karol Bagh',
      riskLevel: 'High Risk',
      rainfall: 185.2,
      status: 'Active Pumping'
    },
    {
      wardId: 'W-015',
      location: 'Chandni Chowk',
      riskLevel: 'High Risk',
      rainfall: 172.8,
      status: 'Drainage Clearing'
    },
    {
      wardId: 'W-028',
      location: 'Dwarka Zone',
      riskLevel: 'Medium Risk',
      rainfall: 142.3,
      status: 'Monitoring'
    },
    {
      wardId: 'W-042',
      location: 'East Delhi',
      riskLevel: 'Medium Risk',
      rainfall: 138.5,
      status: 'Standby'
    },
    {
      wardId: 'W-056',
      location: 'South Delhi',
      riskLevel: 'Low Risk',
      rainfall: 95.7,
      status: 'Normal'
    },
    {
      wardId: 'W-067',
      location: 'North Delhi',
      riskLevel: 'Low Risk',
      rainfall: 78.4,
      status: 'Normal'
    }
  ];

  // Create table
  autoTable(pdf, {
    startY: yPosition,
    head: [['Ward ID', 'Location', 'Risk Level', 'Rainfall (mm)', 'Status']],
    body: wardData.map(ward => [
      ward.wardId,
      ward.location,
      ward.riskLevel,
      ward.rainfall.toString(),
      ward.status
    ]),
    theme: 'grid',
    styles: {
      font: 'Arial',
      fontSize: 9,
      cellPadding: 4,
      textColor: [0, 0, 0],
      lineColor: [0, 0, 0],
      lineWidth: 0.5
    },
    headStyles: {
      fillColor: [50, 50, 50], // Dark gray
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      lineColor: [0, 0, 0],
      lineWidth: 0.8
    },
    bodyStyles: {
      lineColor: [0, 0, 0],
      lineWidth: 0.5
    },
    didParseCell: function (data) {
      // Make "High Risk" rows appear in red text
      if (data.column.index === 2 && data.cell.text[0] === 'High Risk') {
        data.cell.textColor = [192, 0, 0]; // Red
        data.cell.fontStyle = 'bold';
      }
    },
    margin: { left: margin, right: margin },
    didDrawPage: function (data) {
      // Footer will be added after table
    }
  });

  // Get Y position after table
  yPosition = pdf.lastAutoTable.finalY + 15;

  // ==================== FOOTER ====================
  // Bottom line for signature
  const footerY = pageHeight - 25;

  pdf.setFont('Arial', 'normal');
  pdf.setFontSize(9);
  pdf.text('Generated by Jal Nivaran Portal v2.0', margin, footerY);

  // Signature section (right side)
  const signatureX = pageWidth - margin - 50;
  pdf.line(signatureX, footerY - 8, signatureX + 40, footerY - 8); // Signature line
  pdf.text('Chief Engineer (Drainage)', signatureX - 5, footerY + 3, { align: 'center' });

  // Page number at bottom center
  pdf.setFontSize(8);
  pdf.text(`Page 1 of 1`, pageWidth / 2, pageHeight - 8, { align: 'center' });

  return pdf;
};

/**
 * Download the generated PDF with proper filename
 */
export const downloadDailyReport = () => {
  const pdf = generateDailyReport();
  
  // Generate filename with current date
  const currentDate = new Date();
  const dateStr = currentDate.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).replace(/\//g, '-');

  const filename = `MCD_Flood_Report_${dateStr}.pdf`;
  
  // Trigger download
  pdf.save(filename);
};
