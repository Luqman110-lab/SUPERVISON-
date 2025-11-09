
import { Observation, Teacher } from '../types';

const convertToCSV = (data: any[]): string => {
    if (data.length === 0) return '';
    const headers = Object.keys(data[0]);
    const csvRows = [
        headers.join(','),
        ...data.map(row => 
            headers.map(fieldName => 
                JSON.stringify(row[fieldName], (key, value) => value === null ? '' : value)
            ).join(',')
        )
    ];
    return csvRows.join('\r\n');
};

export const exportDataToCSV = (observations: Observation[], teachers: Teacher[]) => {
    const teacherMap = new Map(teachers.map(t => [t.id, t.name]));

    const flattenedData = observations.map(obs => {
        const data: { [key: string]: any } = {
            observationId: obs.id,
            observerName: obs.observerName,
            date: obs.date,
            time: obs.time,
            teacherName: teacherMap.get(obs.teacherId) || 'Unknown',
            className: obs.className,
            subjectTopic: obs.subjectTopic,
            lessonType: obs.lessonType,
            overallScore: obs.overallScore,
            performanceLevel: obs.performanceLevel,
            keyStrengths: obs.keyStrengths,
            areasForDevelopment: obs.areasForDevelopment,
            commendations: obs.commendations,
            recommendations: obs.recommendations,
            followUpDate: obs.followUpDate,
            supportNeeded: obs.supportNeeded,
        };
        obs.domains.forEach(domain => {
            domain.competencies.forEach(comp => {
                data[`${domain.name.replace(/\s+/g, '_')}_${comp.title.replace(/\s+/g, '_')}_Rating`] = comp.rating;
            });
        });
        return data;
    });

    const csvString = convertToCSV(flattenedData);
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Broadway_Observations_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};
