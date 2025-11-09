
import { Domain, PerformanceLevel } from './types';

export const APP_VERSION = '2.0.1';

export const OBSERVATION_FRAMEWORK: Domain[] = [
    {
        id: 'D1',
        name: 'Professional Preparation',
        competencies: [
            { id: 'C1.1', title: 'Lesson Planning', indicators: ['Clear objectives', 'Logical sequence', 'Appropriate resources'], rating: 0, evidence: '' },
            { id: 'C1.2', title: 'Resourcefulness', indicators: ['Use of varied materials', 'Improvisation', 'Technology integration'], rating: 0, evidence: '' },
            { id: 'C1.3', title: 'Time Management', indicators: ['Pacing', 'Transitions', 'Adherence to schedule'], rating: 0, evidence: '' },
        ]
    },
    {
        id: 'D2',
        name: 'Subject Knowledge',
        competencies: [
            { id: 'C2.1', title: 'Content Mastery', indicators: ['Accurate information', 'Depth of knowledge', 'Answers questions effectively'], rating: 0, evidence: '' },
            { id: 'C2.2', title: 'Clarity of Explanation', indicators: ['Simple language', 'Use of examples', 'Checks for understanding'], rating: 0, evidence: '' },
            { id: 'C2.3', title: 'Curriculum Alignment', indicators: ['Covers syllabus', 'Meets standards', 'Builds on prior knowledge'], rating: 0, evidence: '' },
            { id: 'C2.4', title: 'Connects Concepts', indicators: ['Real-world links', 'Cross-curricular connections', 'Explains "why"'], rating: 0, evidence: '' },
        ]
    },
    {
        id: 'D3',
        name: 'Classroom Management',
        competencies: [
            { id: 'C3.1', title: 'Positive Discipline', indicators: ['Clear expectations', 'Consistent routines', 'Respectful correction'], rating: 0, evidence: '' },
            { id: 'C3.2', title: 'Physical Environment', indicators: ['Safe and clean', 'Organized layout', 'Displays of student work'], rating: 0, evidence: '' },
            { id: 'C3.3', title: 'Learner Behavior', indicators: ['Proactive monitoring', 'Handles disruptions well', 'Encourages self-regulation'], rating: 0, evidence: '' },
            { id: 'C3.4', title: 'Material Management', indicators: ['Efficient distribution', 'Orderly collection', 'Learners respect materials'], rating: 0, evidence: '' },
        ]
    },
    {
        id: 'D4',
        name: 'Learner Engagement',
        competencies: [
            { id: 'C4.1', title: 'Active Participation', indicators: ['High on-task behavior', 'Learners ask questions', 'Group collaboration'], rating: 0, evidence: '' },
            { id: 'C4.2', title: 'Questioning Technique', indicators: ['Higher-order questions', 'Wait time', 'All learners involved'], rating: 0, evidence: '' },
            { id: 'C4.3', title: 'Differentiated Instruction', indicators: ['Addresses varied abilities', 'Provides choice', 'Individual support'], rating: 0, evidence: '' },
            { id: 'C4.4', title: 'Enthusiasm & Rapport', indicators: ['Positive tone', 'Shows interest in learners', 'Creates excitement'], rating: 0, evidence: '' },
        ]
    },
    {
        id: 'D5',
        name: 'Assessment & Feedback',
        competencies: [
            { id: 'C5.1', title: 'Variety of Assessments', indicators: ['Formative/Summative', 'Observations', 'Quizzes/Projects'], rating: 0, evidence: '' },
            { id: 'C5.2', title: 'Checking for Understanding', indicators: ['Frequent checks', 'Adjusts teaching based on checks', 'Uses various methods'], rating: 0, evidence: '' },
            { id: 'C5.3', title: 'Quality of Feedback', indicators: ['Timely', 'Specific', 'Constructive and actionable'], rating: 0, evidence: '' },
            { id: 'C5.4', title: 'Record Keeping', indicators: ['Systematic', 'Up-to-date', 'Used to inform planning'], rating: 0, evidence: '' },
        ]
    },
    {
        id: 'D6',
        name: 'Learner Standards',
        competencies: [
            { id: 'C6.1', title: 'Quality of Work', indicators: ['Neatness', 'Completeness', 'Shows effort and pride'], rating: 0, evidence: '' },
            { id: 'C6.2', title: 'Critical Thinking', indicators: ['Problem-solving', 'Analysis', 'Creativity'], rating: 0, evidence: '' },
            { id: 'C6.3', title: 'Communication Skills', indicators: ['Learners articulate ideas', 'Listen to others', 'Use appropriate vocabulary'], rating: 0, evidence: '' },
            { id: 'C6.4', title: 'Independence', indicators: ['Learners work without constant help', 'Take initiative', 'Manage their own tasks'], rating: 0, evidence: '' },
        ]
    },
    {
        id: 'D7',
        name: 'Learning Outcomes',
        competencies: [
            { id: 'C7.1', title: 'Achievement of Objectives', indicators: ['Most learners meet goals', 'Evidence of learning', 'Can apply new knowledge'], rating: 0, evidence: '' },
            { id: 'C7.2', title: 'Progress Over Time', indicators: ['Shows improvement from start of lesson', 'Builds on past skills', 'Can demonstrate growth'], rating: 0, evidence: '' },
            { id: 'C7.3', title: 'Confidence & Attitude', indicators: ['Positive about learning', 'Willing to try', 'Resilient to mistakes'], rating: 0, evidence: '' },
            { id: 'C7.4', title: 'Mastery for All', indicators: ['High expectations for all', 'Struggling learners supported', 'Advanced learners challenged'], rating: 0, evidence: '' },
        ]
    },
    {
        id: 'D8',
        name: 'Relationships & Climate',
        competencies: [
            { id: 'C8.1', title: 'Teacher-Learner Rapport', indicators: ['Mutual respect', 'Fairness', 'Approachable'], rating: 0, evidence: '' },
            { id: 'C8.2', title: 'Learner-Learner Interaction', indicators: ['Collaboration', 'Respect for peers', 'Positive social skills'], rating: 0, evidence: '' },
            { id: 'C8.3', title: 'Inclusive Environment', indicators: ['Values diversity', 'All learners feel they belong', 'No discrimination'], rating: 0, evidence: '' },
            { id: 'C8.4', title: 'Emotional Safety', indicators: ['Learners feel safe to take risks', 'Mistakes are learning tools', 'Positive atmosphere'], rating: 0, evidence: '' },
        ]
    },
    {
        id: 'D9',
        name: 'Contextual Relevance',
        competencies: [
            { id: 'C9.1', title: 'Local Context', indicators: ['Uses local examples', 'Relates to learners\' lives', 'Culturally sensitive'], rating: 0, evidence: '' },
            { id: 'C9.2', title: 'Parent Communication', indicators: ['Regular updates', 'Positive relationships', 'Involves parents in learning'], rating: 0, evidence: '' },
            { id: 'C9.3', title: 'Community Engagement', indicators: ['Connects learning to community', 'Invites community members', 'Aware of local issues'], rating: 0, evidence: '' },
        ]
    },
    {
        id: 'D10',
        name: 'Professional Conduct',
        competencies: [
            { id: 'C10.1', title: 'Professionalism', indicators: ['Punctuality', 'Appropriate dress', 'Positive attitude'], rating: 0, evidence: '' },
            { id: 'C10.2', title: 'Collaboration with Colleagues', indicators: ['Shares ideas', 'Supportive of others', 'Contributes to school goals'], rating: 0, evidence: '' },
            { id: 'C10.3', title: 'Professional Development', indicators: ['Seeks feedback', 'Engages in learning', 'Implements new strategies'], rating: 0, evidence: '' },
        ]
    },
];

export const PROFESSIONAL_MEETING_FRAMEWORK = [
    {
        id: 'A1',
        name: 'Goal Setting & Reflection',
        guidingQuestions: [
            'What has been your biggest success since our last meeting?',
            'What has been the most significant challenge you\'ve faced?',
            'How are you progressing towards your professional goals for this term?',
            'What is one new thing you would like to try in your classroom before we next meet?',
        ],
    },
    {
        id: 'A2',
        name: 'Instructional Practice & Pedagogy',
        guidingQuestions: [
            'Which part of your lesson delivery do you feel most confident about right now?',
            'Is there a specific instructional strategy or technique you\'d like to discuss or get feedback on?',
            'How are you differentiating instruction to meet the needs of all learners in your class?',
            'What assessment data have you collected recently, and what is it telling you about student learning?',
        ],
    },
    {
        id: 'A3',
        name: 'Professional Collaboration & School Culture',
        guidingQuestions: [
            'How have you collaborated with colleagues recently? What was the outcome?',
            'What contribution are you most proud of making to our school community this term?',
            'What is one thing we could do to improve professional collaboration among staff?',
            'How do you feel you are contributing to a positive school culture?',
        ],
    },
    {
        id: 'A4',
        name: 'Well-being & Professional Development',
        guidingQuestions: [
            'On a scale of 1-10, how is your work-life balance right now?',
            'What support do you need from leadership to be more effective and fulfilled in your role?',
            'What professional learning opportunities would be most beneficial for you at this stage?',
            'Is there anything outside of your direct teaching responsibilities that you\'d like to discuss?',
        ],
    },
];


export const RATING_SCALE = [
    { value: 4, label: 'Exemplary', color: 'bg-success' },
    { value: 3, label: 'Proficient', color: 'bg-primary' },
    { value: 2, label: 'Developing', color: 'bg-warning' },
    { value: 1, label: 'Intervention', color: 'bg-danger' },
    { value: 0, label: 'N/A', color: 'bg-gray-400' },
];

export const getPerformanceLevel = (score: number): PerformanceLevel => {
    if (score === 0) return PerformanceLevel.Unrated;
    if (score >= 3.5) return PerformanceLevel.Exemplary;
    if (score >= 2.5) return PerformanceLevel.Proficient;
    if (score >= 1.5) return PerformanceLevel.Developing;
    return PerformanceLevel.Intervention;
};

export const getPerformanceColor = (level: PerformanceLevel): string => {
    switch (level) {
        case PerformanceLevel.Exemplary: return 'bg-success text-white';
        case PerformanceLevel.Proficient: return 'bg-primary text-white';
        case PerformanceLevel.Developing: return 'bg-warning text-gray-800';
        case PerformanceLevel.Intervention: return 'bg-danger text-white';
        default: return 'bg-gray-400 text-white';
    }
};