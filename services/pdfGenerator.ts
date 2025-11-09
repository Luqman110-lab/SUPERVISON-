
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Observation, Teacher } from '../types';
import { RATING_SCALE } from '../constants';

// FIX: Switched to functional usage of jspdf-autotable to resolve "doc.autoTable is not a function" error.
// The autoTable function is now imported and called directly with the doc object.

const addHeader = (doc: jsPDF, title: string) => {
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#1e3a8a'); // primary-dark
    doc.text("The Architect's Dashboard", 14, 20);
    doc.setFontSize(14);
    doc.setTextColor('#111827');
    doc.text(title, 14, 28);
    doc.setDrawColor('#1e40af'); // primary
    doc.line(14, 32, 196, 32);
};

const addFooter = (doc: jsPDF) => {
    const pageCount = (doc as any).internal.getNumberOfPages();
    doc.setFontSize(8);
    doc.setTextColor('#6b7280');
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width / 2, 287, { align: 'center' });
        doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 287);
    }
};

const getRatingLabel = (rating: number): string => {
    return RATING_SCALE.find(r => r.value === rating)?.label || 'N/A';
}

export const generateObservationPDF = (observation: Observation) => {
    const doc = new jsPDF();
    addHeader(doc, "Teacher Observation Report");
    
    let y = 40;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Observation Details', 14, y);
    y += 5;

    autoTable(doc, {
        startY: y,
        body: [
            ['Observer:', observation.observerName, 'Teacher:', observation.teacherName],
            ['Date:', new Date(observation.date).toLocaleDateString(), 'Class:', observation.className],
            ['Time:', observation.time, 'Subject/Topic:', observation.subjectTopic],
            ['Lesson Type:', observation.lessonType, 'Overall Score:', `${observation.overallScore.toFixed(2)} (${observation.performanceLevel})`]
        ],
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 2 },
        headStyles: { fillColor: '#dbeafe' }, // blue-100
    });
    
    y = (doc as any).lastAutoTable.finalY + 10;

    observation.domains.forEach(domain => {
        if (y > 260) {
            doc.addPage();
            y = 20;
        }
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#1e40af'); // primary
        doc.text(domain.name, 14, y);
        y += 5;

        const tableBody = domain.competencies.map(comp => [
            { content: comp.title, styles: { fontStyle: 'bold' } },
            getRatingLabel(comp.rating),
            comp.evidence || 'No evidence provided.'
        ]);
        
        autoTable(doc, {
            startY: y,
            head: [['Competency', 'Rating', 'Evidence']],
            body: tableBody,
            theme: 'striped',
            headStyles: { fillColor: '#eff6ff', textColor: '#1e3a8a' }, // blue-50, primary-dark
            styles: { fontSize: 9, cellPadding: 2 },
            columnStyles: { 2: { cellWidth: 80 } },
        });

        y = (doc as any).lastAutoTable.finalY + 10;
    });

    if (y > 260) {
        doc.addPage();
        y = 20;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary', 14, y);
    y+= 5;
    
    const summaryData = [
        ['Key Strengths', observation.keyStrengths || 'N/A'],
        ['Areas for Development', observation.areasForDevelopment || 'N/A'],
        ['Commendations', observation.commendations || 'N/A'],
        ['Recommendations', observation.recommendations || 'N/A'],
        ['Follow-up Date', observation.followUpDate ? new Date(observation.followUpDate).toLocaleDateString() : 'N/A'],
        ['Support Needed', observation.supportNeeded || 'N/A']
    ];

    autoTable(doc, {
        startY: y,
        body: summaryData,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 2 },
        columnStyles: { 0: { fontStyle: 'bold' } }
    });
    y = (doc as any).lastAutoTable.finalY + 20;

    if (y > 260) {
        doc.addPage();
        y = 20;
    }
    
    doc.text('Signatures', 14, y);
    doc.line(14, y + 10, 80, y + 10);
    doc.text('Observer Signature', 14, y + 14);
    doc.line(130, y + 10, 196, y + 10);
    doc.text('Teacher Signature', 130, y + 14);

    addFooter(doc);

    doc.save(`Observation_${observation.teacherName}_${observation.date}.pdf`);
};

export const generateTeacherSummaryPDF = (teacher: Teacher, observations: Observation[]) => {
    const doc = new jsPDF();
    const obsCount = observations.length;
    const avgScore = obsCount > 0 ? observations.reduce((acc, obs) => acc + obs.overallScore, 0) / obsCount : 0;

    addHeader(doc, `Performance Summary: ${teacher.name}`);
    
    let y = 40;

    autoTable(doc, {
        startY: y,
        body: [
            ['Teacher:', teacher.name],
            ['Total Observations:', obsCount],
            ['Average Score:', avgScore.toFixed(2)],
        ],
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 2 },
    });

    y = (doc as any).lastAutoTable.finalY + 10;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Observation History', 14, y);
    y += 5;

    const tableBody = observations.map(obs => [
        new Date(obs.date).toLocaleDateString(),
        obs.subjectTopic,
        obs.overallScore.toFixed(2),
        obs.performanceLevel
    ]);

     autoTable(doc, {
        startY: y,
        head: [['Date', 'Subject/Topic', 'Score', 'Level']],
        body: tableBody,
        theme: 'striped',
        headStyles: { fillColor: '#eff6ff', textColor: '#1e3a8a' },
    });

    addFooter(doc);
    doc.save(`Summary_${teacher.name}.pdf`);
}