// src/lib/pdfGenerator.js
// Generates a per-module cybersecurity training certificate PDF using pdf-lib.

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function generateCertificatePDF({
  recipientName,
  moduleName,
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
  const navy      = rgb(0.04, 0.09, 0.18)
  const blue      = rgb(0.14, 0.37, 0.93)
  const gold      = rgb(0.85, 0.65, 0.13)
  const white     = rgb(1, 1, 1)
  const lightGray = rgb(0.94, 0.94, 0.96)
  const darkGray  = rgb(0.35, 0.35, 0.40)

  // ── Background ────────────────────────────────────────────────
  page.drawRectangle({ x: 0, y: 0, width, height, color: navy })

  page.drawRectangle({ x: 0, y: height - 8, width, height: 8, color: gold })
  page.drawRectangle({ x: 0, y: 0, width, height: 8, color: gold })
  page.drawRectangle({ x: 0, y: 0, width: 8, height, color: gold })
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

  // ── Logo ──────────────────────────────────────────────────────
  try {
    const logoBytes = readFileSync(join(process.cwd(), 'public', 'FortiBank Favicon1 transparent.png'))
    const logoImage = await pdfDoc.embedPng(logoBytes)
    const logoDims  = logoImage.scaleToFit(52, 52)
    page.drawImage(logoImage, {
      x:      (width - logoDims.width) / 2,
      y:      height - 108,
      width:  logoDims.width,
      height: logoDims.height,
    })
  } catch {
    // Fallback: blue shield ellipse
    page.drawEllipse({ x: width / 2, y: height - 88, xScale: 28, yScale: 32, color: blue })
  }

  // ── Header ────────────────────────────────────────────────────
  const titleText  = 'FORTIBANK'
  const titleWidth = helveticaBold.widthOfTextAtSize(titleText, 26)
  page.drawText(titleText, {
    x: (width - titleWidth) / 2,
    y: height - 138,
    size: 26, font: helveticaBold, color: white,
  })

  const subtitleText  = 'CYBERSECURITY TRAINING PROGRAM'
  const subtitleWidth = helvetica.widthOfTextAtSize(subtitleText, 9)
  page.drawText(subtitleText, {
    x: (width - subtitleWidth) / 2,
    y: height - 155,
    size: 9, font: helvetica, color: gold, characterSpacing: 2,
  })

  page.drawLine({
    start: { x: 100, y: height - 168 },
    end:   { x: width - 100, y: height - 168 },
    thickness: 0.5, color: gold, opacity: 0.5,
  })

  // ── Main content ──────────────────────────────────────────────
  const certText  = 'Certificate of Completion'
  const certWidth = helveticaOblique.widthOfTextAtSize(certText, 20)
  page.drawText(certText, {
    x: (width - certWidth) / 2,
    y: height - 205,
    size: 20, font: helveticaOblique, color: lightGray,
  })

  const thisText  = 'This certifies that'
  const thisWidth = helvetica.widthOfTextAtSize(thisText, 11)
  page.drawText(thisText, {
    x: (width - thisWidth) / 2,
    y: height - 242,
    size: 11, font: helvetica, color: darkGray,
  })

  // Recipient name
  const nameWidth = helveticaBold.widthOfTextAtSize(recipientName, 34)
  page.drawText(recipientName, {
    x: (width - nameWidth) / 2,
    y: height - 290,
    size: 34, font: helveticaBold, color: white,
  })

  page.drawLine({
    start: { x: (width - nameWidth) / 2,       y: height - 298 },
    end:   { x: (width + nameWidth) / 2,       y: height - 298 },
    thickness: 1, color: gold, opacity: 0.6,
  })

  // Congratulations line
  const congratsText  = 'Congratulations on completing this module!'
  const congratsWidth = helveticaOblique.widthOfTextAtSize(congratsText, 12)
  page.drawText(congratsText, {
    x: (width - congratsWidth) / 2,
    y: height - 322,
    size: 12, font: helveticaOblique, color: gold,
  })

  // Module name
  const moduleDisplayText = moduleName
  const moduleWidth       = helveticaBold.widthOfTextAtSize(moduleDisplayText, 13)
  page.drawText(moduleDisplayText, {
    x: (width - moduleWidth) / 2,
    y: height - 348,
    size: 13, font: helveticaBold, color: lightGray,
  })

  // Description
  const descText  = 'has successfully completed all required training content and assessments'
  const descWidth = helvetica.widthOfTextAtSize(descText, 10)
  page.drawText(descText, {
    x: (width - descWidth) / 2,
    y: height - 372,
    size: 10, font: helvetica, color: darkGray,
  })

  const desc2Text  = 'demonstrating the knowledge and skills required to maintain a secure banking environment.'
  const desc2Width = helvetica.widthOfTextAtSize(desc2Text, 10)
  page.drawText(desc2Text, {
    x: (width - desc2Width) / 2,
    y: height - 387,
    size: 10, font: helvetica, color: darkGray,
  })

  // ── Footer ────────────────────────────────────────────────────
  page.drawLine({
    start: { x: 100, y: height - 410 },
    end:   { x: width - 100, y: height - 410 },
    thickness: 0.5, color: gold, opacity: 0.3,
  })

  const issuedDate = new Date(issuedAt).toLocaleDateString('en-KE', { dateStyle: 'long' })
  const validDate  = new Date(validUntil).toLocaleDateString('en-KE', { dateStyle: 'long' })

  // Left: Issue date
  page.drawText('DATE ISSUED', {
    x: 120, y: height - 438, size: 8, font: helvetica, color: darkGray, characterSpacing: 1,
  })
  page.drawText(issuedDate, {
    x: 120, y: height - 454, size: 11, font: helveticaBold, color: white,
  })

  // Center: Certificate number
  const certNoWidth = helveticaBold.widthOfTextAtSize(certificateNo, 11)
  page.drawText('CERTIFICATE NO.', {
    x: (width - helvetica.widthOfTextAtSize('CERTIFICATE NO.', 8)) / 2,
    y: height - 438, size: 8, font: helvetica, color: darkGray, characterSpacing: 1,
  })
  page.drawText(certificateNo, {
    x: (width - certNoWidth) / 2,
    y: height - 454, size: 11, font: helveticaBold, color: gold,
  })

  // Right: Valid until
  page.drawText('VALID UNTIL', {
    x: width - 120 - helvetica.widthOfTextAtSize('VALID UNTIL', 8),
    y: height - 438, size: 8, font: helvetica, color: darkGray, characterSpacing: 1,
  })
  page.drawText(validDate, {
    x: width - 120 - helveticaBold.widthOfTextAtSize(validDate, 11),
    y: height - 454, size: 11, font: helveticaBold, color: white,
  })

  // Watermark
  const wmText  = 'FORTIBANK CYBERSECURITY TRAINING'
  const wmWidth = helveticaBold.widthOfTextAtSize(wmText, 7)
  page.drawText(wmText, {
    x: (width - wmWidth) / 2,
    y: 22, size: 7, font: helveticaBold, color: gold, opacity: 0.4, characterSpacing: 1,
  })

  return await pdfDoc.save()
}
