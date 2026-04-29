// src/lib/pdfGenerator.js
// Generates a cybersecurity training certificate PDF
// using pdf-lib. Returns the PDF as a Uint8Array.

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
/**
 * Generates a certificate PDF and returns it as a Uint8Array
 */
export async function generateCertificatePDF({
  recipientName,
  roleName,
  certificateNo,
  issuedAt,
  validUntil,
}) {
  const pdfDoc = await PDFDocument.create()

  // Landscape A4
  const page = pdfDoc.addPage([841.89, 595.28])
  const { width, height } = page.getSize()

  // Fonts
  const helveticaBold    = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const helvetica        = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique)

  // Colors
  const navy      = rgb(0.04, 0.09, 0.18)   // #0a1730
  const blue      = rgb(0.14, 0.37, 0.93)   // #235eee
  const gold      = rgb(0.85, 0.65, 0.13)   // #d9a621
  const white     = rgb(1, 1, 1)
  const lightGray = rgb(0.94, 0.94, 0.96)
  const darkGray  = rgb(0.35, 0.35, 0.40)

  // ── Background ────────────────────────────────────────────
  page.drawRectangle({ x: 0, y: 0, width, height, color: navy })

  // Top accent bar
  page.drawRectangle({ x: 0, y: height - 8, width, height: 8, color: gold })

  // Bottom accent bar
  page.drawRectangle({ x: 0, y: 0, width, height: 8, color: gold })

  // Left accent bar
  page.drawRectangle({ x: 0, y: 0, width: 8, height, color: gold })

  // Right accent bar
  page.drawRectangle({ x: width - 8, y: 0, width: 8, height, color: gold })

  // Inner content area
  page.drawRectangle({
    x: 40, y: 40,
    width: width - 80,
    height: height - 80,
    color: rgb(0.06, 0.12, 0.22),
    borderColor: gold,
    borderWidth: 1,
  })

  // ── Header ────────────────────────────────────────────────
  // Shield icon placeholder (drawn as polygon-like shape)
  page.drawEllipse({
    x: width / 2,
    y: height - 100,
    xScale: 32,
    yScale: 36,
    color: blue,
  })

  // FortiBank
  const titleText = 'FORTIBANK'
  const titleWidth = helveticaBold.widthOfTextAtSize(titleText, 28)
  page.drawText(titleText, {
    x: (width - titleWidth) / 2,
    y: height - 145,
    size: 28,
    font: helveticaBold,
    color: white,
  })

  // Subtitle
  const subtitleText = 'CYBERSECURITY TRAINING PROGRAM'
  const subtitleWidth = helvetica.widthOfTextAtSize(subtitleText, 10)
  page.drawText(subtitleText, {
    x: (width - subtitleWidth) / 2,
    y: height - 163,
    size: 10,
    font: helvetica,
    color: gold,
    characterSpacing: 2,
  })

  // Divider line
  page.drawLine({
    start: { x: 100, y: height - 175 },
    end:   { x: width - 100, y: height - 175 },
    thickness: 0.5,
    color: gold,
    opacity: 0.5,
  })

  // ── Main content ──────────────────────────────────────────
  // "Certificate of Completion"
  const certText = 'Certificate of Completion'
  const certWidth = helveticaOblique.widthOfTextAtSize(certText, 22)
  page.drawText(certText, {
    x: (width - certWidth) / 2,
    y: height - 215,
    size: 22,
    font: helveticaOblique,
    color: lightGray,
  })

  // "This certifies that"
  const thisText = 'This certifies that'
  const thisWidth = helvetica.widthOfTextAtSize(thisText, 12)
  page.drawText(thisText, {
    x: (width - thisWidth) / 2,
    y: height - 255,
    size: 12,
    font: helvetica,
    color: darkGray,
  })

  // Recipient name
  const nameWidth = helveticaBold.widthOfTextAtSize(recipientName, 36)
  page.drawText(recipientName, {
    x: (width - nameWidth) / 2,
    y: height - 305,
    size: 36,
    font: helveticaBold,
    color: white,
  })

  // Name underline
  page.drawLine({
    start: { x: (width - nameWidth) / 2, y: height - 312 },
    end:   { x: (width + nameWidth) / 2, y: height - 312 },
    thickness: 1,
    color: gold,
    opacity: 0.6,
  })

  // Role
  const roleText = `${roleName}`
  const roleWidth = helvetica.widthOfTextAtSize(roleText, 13)
  page.drawText(roleText, {
    x: (width - roleWidth) / 2,
    y: height - 335,
    size: 13,
    font: helvetica,
    color: gold,
  })

  // Description
  const descText = 'has successfully completed all required cybersecurity training modules'
  const descWidth = helvetica.widthOfTextAtSize(descText, 11)
  page.drawText(descText, {
    x: (width - descWidth) / 2,
    y: height - 365,
    size: 11,
    font: helvetica,
    color: darkGray,
  })

  const desc2Text = 'and demonstrated the knowledge required to maintain a secure banking environment.'
  const desc2Width = helvetica.widthOfTextAtSize(desc2Text, 11)
  page.drawText(desc2Text, {
    x: (width - desc2Width) / 2,
    y: height - 382,
    size: 11,
    font: helvetica,
    color: darkGray,
  })

  // ── Footer ────────────────────────────────────────────────
  // Divider
  page.drawLine({
    start: { x: 100, y: height - 415 },
    end:   { x: width - 100, y: height - 415 },
    thickness: 0.5,
    color: gold,
    opacity: 0.3,
  })

  // Date issued
  const issuedDate  = new Date(issuedAt).toLocaleDateString('en-KE', { dateStyle: 'long' })
  const validDate   = new Date(validUntil).toLocaleDateString('en-KE', { dateStyle: 'long' })

  // Left: Issue date
  page.drawText('DATE ISSUED', {
    x: 120, y: height - 445,
    size: 8, font: helvetica, color: darkGray, characterSpacing: 1,
  })
  page.drawText(issuedDate, {
    x: 120, y: height - 462,
    size: 11, font: helveticaBold, color: white,
  })

  // Center: Certificate number
  const certNoText = certificateNo
  const certNoWidth = helveticaBold.widthOfTextAtSize(certNoText, 11)
  page.drawText('CERTIFICATE NO.', {
    x: (width - helvetica.widthOfTextAtSize('CERTIFICATE NO.', 8)) / 2,
    y: height - 445,
    size: 8, font: helvetica, color: darkGray, characterSpacing: 1,
  })
  page.drawText(certNoText, {
    x: (width - certNoWidth) / 2,
    y: height - 462,
    size: 11, font: helveticaBold, color: gold,
  })

  // Right: Valid until
  const validText = `Valid until: ${validDate}`
  const validWidth = helvetica.widthOfTextAtSize(validText, 11)
  page.drawText('VALID UNTIL', {
    x: width - 120 - helvetica.widthOfTextAtSize('VALID UNTIL', 8),
    y: height - 445,
    size: 8, font: helvetica, color: darkGray, characterSpacing: 1,
  })
  page.drawText(validDate, {
    x: width - 120 - helveticaBold.widthOfTextAtSize(validDate, 11),
    y: height - 462,
    size: 11, font: helveticaBold, color: white,
  })

  // Watermark text
  const wmText = 'FORTIBANK CYBERSECURITY TRAINING'
  const wmWidth = helveticaBold.widthOfTextAtSize(wmText, 7)
  page.drawText(wmText, {
    x: (width - wmWidth) / 2,
    y: 22,
    size: 7, font: helveticaBold, color: gold, opacity: 0.4, characterSpacing: 1,
  })

  const pdfBytes = await pdfDoc.save()
  return pdfBytes
}