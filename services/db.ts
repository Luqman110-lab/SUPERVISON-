
import { Observation, Teacher, ProfessionalGrowthMeeting } from '../types';

const DB_NAME = 'ArchitectDashboardDB';
const DB_VERSION = 2; // Incremented version for schema change
const TEACHERS_STORE = 'teachers';
const OBSERVATIONS_STORE = 'observations';
const MEETINGS_STORE = 'meetings';


let db: IDBDatabase;

export const initDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        if (db) {
            return resolve(db);
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event) => {
            console.error('Database error:', request.error);
            reject('Database error');
        };

        request.onsuccess = (event) => {
            db = (event.target as IDBOpenDBRequest).result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(TEACHERS_STORE)) {
                db.createObjectStore(TEACHERS_STORE, { keyPath: 'id', autoIncrement: true });
            }
            if (!db.objectStoreNames.contains(OBSERVATIONS_STORE)) {
                const observationsStore = db.createObjectStore(OBSERVATIONS_STORE, { keyPath: 'id', autoIncrement: true });
                observationsStore.createIndex('teacherId', 'teacherId', { unique: false });
                observationsStore.createIndex('date', 'date', { unique: false });
            }
            if (!db.objectStoreNames.contains(MEETINGS_STORE)) {
                const meetingsStore = db.createObjectStore(MEETINGS_STORE, { keyPath: 'id', autoIncrement: true });
                meetingsStore.createIndex('teacherId', 'teacherId', { unique: false });
            }
        };
    });
};

// Generic CRUD operations
const performDbOperation = <T,>(storeName: string, mode: IDBTransactionMode, operation: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> => {
    return new Promise(async (resolve, reject) => {
        const db = await initDB();
        const transaction = db.transaction(storeName, mode);
        const store = transaction.objectStore(storeName);

        const request = operation(store);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
    });
};

// Teacher operations
export const addTeacher = (teacher: Teacher) => performDbOperation(TEACHERS_STORE, 'readwrite', store => store.add(teacher));
export const getAllTeachers = () => performDbOperation<Teacher[]>(TEACHERS_STORE, 'readonly', store => store.getAll());
export const getTeacher = (id: number) => performDbOperation<Teacher>(TEACHERS_STORE, 'readonly', store => store.get(id));
export const updateTeacher = (teacher: Teacher) => performDbOperation(TEACHERS_STORE, 'readwrite', store => store.put(teacher));
export const deleteTeacher = (id: number) => performDbOperation(TEACHERS_STORE, 'readwrite', store => store.delete(id));

// Observation operations
export const addObservation = (observation: Observation) => performDbOperation(OBSERVATIONS_STORE, 'readwrite', store => store.add(observation));
export const getAllObservations = () => performDbOperation<Observation[]>(OBSERVATIONS_STORE, 'readonly', store => store.getAll());
export const getObservation = (id: number) => performDbOperation<Observation>(OBSERVATIONS_STORE, 'readonly', store => store.get(id));
export const getObservationsForTeacher = (teacherId: number) => {
     return new Promise<Observation[]>(async (resolve, reject) => {
        const db = await initDB();
        const transaction = db.transaction(OBSERVATIONS_STORE, 'readonly');
        const store = transaction.objectStore(OBSERVATIONS_STORE);
        const index = store.index('teacherId');
        const request = index.getAll(teacherId);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
    });
};

export const updateObservation = (observation: Observation) => performDbOperation(OBSERVATIONS_STORE, 'readwrite', store => store.put(observation));
export const deleteObservation = (id: number) => performDbOperation(OBSERVATIONS_STORE, 'readwrite', store => store.delete(id));


// Meeting operations
export const addMeeting = (meeting: ProfessionalGrowthMeeting) => performDbOperation(MEETINGS_STORE, 'readwrite', store => store.add(meeting));
export const getAllMeetings = () => performDbOperation<ProfessionalGrowthMeeting[]>(MEETINGS_STORE, 'readonly', store => store.getAll());
export const getMeetingsForTeacher = (teacherId: number) => {
    return new Promise<ProfessionalGrowthMeeting[]>(async (resolve, reject) => {
        const db = await initDB();
        const transaction = db.transaction(MEETINGS_STORE, 'readonly');
        const store = transaction.objectStore(MEETINGS_STORE);
        const index = store.index('teacherId');
        const request = index.getAll(teacherId);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
    });
};
export const updateMeeting = (meeting: ProfessionalGrowthMeeting) => performDbOperation(MEETINGS_STORE, 'readwrite', store => store.put(meeting));
export const deleteMeeting = (id: number) => performDbOperation(MEETINGS_STORE, 'readwrite', store => store.delete(id));


// Data Management
export const exportData = async (): Promise<string> => {
    const teachers = await getAllTeachers();
    const observations = await getAllObservations();
    const meetings = await getAllMeetings();
    const data = {
        version: '2.0.2',
        exportDate: new Date().toISOString(),
        teachers,
        observations,
        meetings,
    };
    return JSON.stringify(data, null, 2);
};

export const importData = async (jsonString: string): Promise<{ teachers: number; observations: number; meetings: number; }> => {
    const data = JSON.parse(jsonString);
    if (!data.teachers || !data.observations) {
        throw new Error('Invalid backup file format.');
    }

    const db = await initDB();
    const teacherTx = db.transaction(TEACHERS_STORE, 'readwrite');
    const teacherStore = teacherTx.objectStore(TEACHERS_STORE);
    for (const teacher of data.teachers) {
        delete teacher.id; // Let IndexedDB assign new IDs to avoid conflicts
        teacherStore.add(teacher);
    }
    
    const obsTx = db.transaction(OBSERVATIONS_STORE, 'readwrite');
    const obsStore = obsTx.objectStore(OBSERVATIONS_STORE);
     for (const observation of data.observations) {
        delete observation.id;
        obsStore.add(observation);
    }

    const meetings = data.meetings || [];
    if (meetings.length > 0) {
        const meetingTx = db.transaction(MEETINGS_STORE, 'readwrite');
        const meetingStore = meetingTx.objectStore(MEETINGS_STORE);
        for (const meeting of meetings) {
            delete meeting.id;
            meetingStore.add(meeting);
        }
    }
    
    return { teachers: data.teachers.length, observations: data.observations.length, meetings: meetings.length };
};


export const clearAllData = async (): Promise<void> => {
    const db = await initDB();
    const stores = [TEACHERS_STORE, OBSERVATIONS_STORE, MEETINGS_STORE];
    const tx = db.transaction(stores, 'readwrite');
    for (const storeName of stores) {
        tx.objectStore(storeName).clear();
    }
};