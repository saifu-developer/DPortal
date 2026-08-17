package com.clinic.service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clinic.entity.Patient;
import com.clinic.entity.Prescription;
import com.clinic.repository.PatientRepository;
import com.clinic.repository.PrescriptionRepository;
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

@Service
public class PrescriptionPdfService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private PatientRepository patientRepository;

    public byte[] generatePdf(Long prescriptionId) {
        Prescription prescription = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new RuntimeException("Prescription not found"));

        Patient patient = patientRepository.findById(prescription.getPatientId())
                .orElse(null);

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, baos);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
            Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 11);

            Paragraph title = new Paragraph("Medical Prescription", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            Paragraph clinic = new Paragraph("KurePulse Clinic", headerFont);
            clinic.setAlignment(Element.ALIGN_CENTER);
            clinic.setSpacingAfter(4);
            document.add(clinic);

            Paragraph sub = new Paragraph("Single Doctor Healthcare Center", bodyFont);
            sub.setAlignment(Element.ALIGN_CENTER);
            sub.setSpacingAfter(20);
            document.add(sub);

            PdfPTable infoTable = new PdfPTable(2);
            infoTable.setWidthPercentage(100);
            infoTable.setSpacingBefore(10);
            infoTable.setSpacingAfter(20);

            addCell(infoTable, "Patient Name:", headerFont);
            addCell(infoTable, patient != null ? patient.getFullName() : "N/A", bodyFont);
            addCell(infoTable, "Patient Code:", headerFont);
            addCell(infoTable, patient != null ? patient.getPatientCode() : "N/A", bodyFont);
            addCell(infoTable, "Mobile:", headerFont);
            addCell(infoTable, patient != null ? patient.getMobile() : "N/A", bodyFont);
            addCell(infoTable, "Date:", headerFont);
            addCell(infoTable, prescription.getPrescribedDate() != null
                    ? prescription.getPrescribedDate().format(DateTimeFormatter.ofPattern("dd MMM yyyy"))
                    : "N/A", bodyFont);

            document.add(infoTable);

            document.add(new Paragraph("Diagnosis", headerFont));
            document.add(spacedParagraph(prescription.getDiagnosis(), bodyFont));

            document.add(new Paragraph("Medicines", headerFont));
            document.add(spacedParagraph(prescription.getMedicines(), bodyFont));

            document.add(new Paragraph("Dosage & Instructions", headerFont));
            document.add(spacedParagraph(prescription.getInstructions(), bodyFont));

            Paragraph footer = new Paragraph("\n\nAuthorized by: Dr. Clinic Admin", bodyFont);
            footer.setAlignment(Element.ALIGN_RIGHT);
            document.add(footer);

            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF", e);
        }
    }

    private void addCell(PdfPTable table, String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text != null ? text : "", font));
        cell.setBorder(PdfPCell.NO_BORDER);
        cell.setPadding(4);
        table.addCell(cell);
    }

    private Paragraph spacedParagraph(String text, Font font) {
        Paragraph p = new Paragraph(text != null ? text : "—", font);
        p.setSpacingAfter(12);
        return p;
    }
}
