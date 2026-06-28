const bcrypt = require('bcryptjs');

// In-memory database
const db = {
  users: [
    {
      id: 'admin-001',
      name: 'Dr. Priya Sharma',
      email: 'admin@unitrack.edu',
      password: bcrypt.hashSync('admin123', 10),
      role: 'admin',
      department: 'Computer Science',
      avatar: 'PS'
    },
    {
      id: 'student-001',
      name: 'Rahul Verma',
      email: 'rahul@unitrack.edu',
      password: bcrypt.hashSync('student123', 10),
      role: 'student',
      course: 'B.Tech CSE',
      semester: 5,
      rollNo: 'CSE2021045',
      avatar: 'RV'
    },
    {
      id: 'student-002',
      name: 'Anjali Mehta',
      email: 'anjali@unitrack.edu',
      password: bcrypt.hashSync('student123', 10),
      role: 'student',
      course: 'B.Tech CSE',
      semester: 5,
      rollNo: 'CSE2021046',
      avatar: 'AM'
    }
  ],

  notices: [
    {
      id: 'notice-001',
      title: 'Mid-Semester Exam Schedule Released',
      content: 'The mid-semester examination schedule for Semester 5 has been released. Exams will be conducted from July 15–22, 2026. Students are advised to check their timetable and prepare accordingly.',
      category: 'exam',
      priority: 'high',
      createdBy: 'admin-001',
      createdByName: 'Dr. Priya Sharma',
      createdAt: new Date('2026-06-25').toISOString(),
      targetAudience: 'all'
    },
    {
      id: 'notice-002',
      title: 'Workshop on Machine Learning – Registrations Open',
      content: 'The CS Department is organizing a 2-day workshop on Machine Learning fundamentals on July 5–6. Registration is free for all enrolled students. Limited seats available.',
      category: 'event',
      priority: 'medium',
      createdBy: 'admin-001',
      createdByName: 'Dr. Priya Sharma',
      createdAt: new Date('2026-06-24').toISOString(),
      targetAudience: 'all'
    },
    {
      id: 'notice-003',
      title: 'Library Timings Extended During Exams',
      content: 'The central library will remain open until 10 PM during the exam period (July 10–25). Students can use study rooms by prior booking through the library portal.',
      category: 'general',
      priority: 'low',
      createdBy: 'admin-001',
      createdByName: 'Dr. Priya Sharma',
      createdAt: new Date('2026-06-23').toISOString(),
      targetAudience: 'all'
    }
  ],

  timetable: [
    { id: 'tt-001', day: 'Monday', startTime: '09:00', endTime: '10:00', subject: 'Data Structures', teacher: 'Prof. Anil Kumar', room: 'LH-201', semester: 5 },
    { id: 'tt-002', day: 'Monday', startTime: '10:00', endTime: '11:00', subject: 'Operating Systems', teacher: 'Dr. Sunita Rao', room: 'LH-201', semester: 5 },
    { id: 'tt-003', day: 'Monday', startTime: '11:15', endTime: '12:15', subject: 'Computer Networks', teacher: 'Prof. Ramesh Joshi', room: 'LH-202', semester: 5 },
    { id: 'tt-004', day: 'Monday', startTime: '14:00', endTime: '16:00', subject: 'DBMS Lab', teacher: 'Dr. Priya Sharma', room: 'Lab-301', semester: 5 },
    { id: 'tt-005', day: 'Tuesday', startTime: '09:00', endTime: '10:00', subject: 'Software Engineering', teacher: 'Dr. Priya Sharma', room: 'LH-203', semester: 5 },
    { id: 'tt-006', day: 'Tuesday', startTime: '10:00', endTime: '11:00', subject: 'Data Structures', teacher: 'Prof. Anil Kumar', room: 'LH-201', semester: 5 },
    { id: 'tt-007', day: 'Tuesday', startTime: '11:15', endTime: '12:15', subject: 'Database Management', teacher: 'Dr. Priya Sharma', room: 'LH-202', semester: 5 },
    { id: 'tt-008', day: 'Wednesday', startTime: '09:00', endTime: '11:00', subject: 'Networks Lab', teacher: 'Prof. Ramesh Joshi', room: 'Lab-302', semester: 5 },
    { id: 'tt-009', day: 'Wednesday', startTime: '11:15', endTime: '12:15', subject: 'Operating Systems', teacher: 'Dr. Sunita Rao', room: 'LH-201', semester: 5 },
    { id: 'tt-010', day: 'Thursday', startTime: '09:00', endTime: '10:00', subject: 'Computer Networks', teacher: 'Prof. Ramesh Joshi', room: 'LH-202', semester: 5 },
    { id: 'tt-011', day: 'Thursday', startTime: '10:00', endTime: '11:00', subject: 'Software Engineering', teacher: 'Dr. Priya Sharma', room: 'LH-203', semester: 5 },
    { id: 'tt-012', day: 'Thursday', startTime: '14:00', endTime: '16:00', subject: 'DS Lab', teacher: 'Prof. Anil Kumar', room: 'Lab-301', semester: 5 },
    { id: 'tt-013', day: 'Friday', startTime: '09:00', endTime: '10:00', subject: 'Database Management', teacher: 'Dr. Priya Sharma', room: 'LH-202', semester: 5 },
    { id: 'tt-014', day: 'Friday', startTime: '10:00', endTime: '11:00', subject: 'Data Structures', teacher: 'Prof. Anil Kumar', room: 'LH-201', semester: 5 },
    { id: 'tt-015', day: 'Friday', startTime: '11:15', endTime: '12:15', subject: 'Operating Systems', teacher: 'Dr. Sunita Rao', room: 'LH-201', semester: 5 },
  ],

  assignments: [
    {
      id: 'assign-001',
      title: 'AVL Tree Implementation',
      subject: 'Data Structures',
      description: 'Implement an AVL tree in C++ with insert, delete, and search operations. Include a visualization of rotations.',
      dueDate: new Date('2026-07-05').toISOString(),
      totalMarks: 20,
      createdBy: 'admin-001',
      createdAt: new Date('2026-06-20').toISOString(),
      semester: 5,
      submissions: [
        { studentId: 'student-001', submittedAt: new Date('2026-06-28').toISOString(), marks: null, status: 'submitted' }
      ]
    },
    {
      id: 'assign-002',
      title: 'Process Scheduling Simulator',
      subject: 'Operating Systems',
      description: 'Build a simulator for CPU scheduling algorithms: FCFS, SJF, Round Robin, and Priority Scheduling. Show Gantt chart output.',
      dueDate: new Date('2026-07-10').toISOString(),
      totalMarks: 30,
      createdBy: 'admin-001',
      createdAt: new Date('2026-06-22').toISOString(),
      semester: 5,
      submissions: []
    },
    {
      id: 'assign-003',
      title: 'ER Diagram – Hospital Management System',
      subject: 'Database Management',
      description: 'Design a comprehensive ER diagram for a Hospital Management System. Convert it to relational schema and write 10 SQL queries.',
      dueDate: new Date('2026-07-08').toISOString(),
      totalMarks: 25,
      createdBy: 'admin-001',
      createdAt: new Date('2026-06-21').toISOString(),
      semester: 5,
      submissions: [
        { studentId: 'student-001', submittedAt: new Date('2026-06-27').toISOString(), marks: 22, status: 'graded' },
        { studentId: 'student-002', submittedAt: new Date('2026-06-26').toISOString(), marks: null, status: 'submitted' }
      ]
    }
  ],

  attendance: {
    'student-001': [
      { subject: 'Data Structures', total: 24, present: 22 },
      { subject: 'Operating Systems', total: 20, present: 18 },
      { subject: 'Computer Networks', total: 22, present: 19 },
      { subject: 'Database Management', total: 21, present: 20 },
      { subject: 'Software Engineering', total: 18, present: 15 }
    ],
    'student-002': [
      { subject: 'Data Structures', total: 24, present: 20 },
      { subject: 'Operating Systems', total: 20, present: 16 },
      { subject: 'Computer Networks', total: 22, present: 22 },
      { subject: 'Database Management', total: 21, present: 18 },
      { subject: 'Software Engineering', total: 18, present: 17 }
    ]
  },

  notes: [
    {
      id: 'note-001',
      title: 'AVL Trees – Complete Notes',
      subject: 'Data Structures',
      description: 'Comprehensive notes covering AVL trees, rotations, height balance property, and complexity analysis.',
      fileType: 'pdf',
      uploadedBy: 'admin-001',
      uploadedByName: 'Prof. Anil Kumar',
      uploadedAt: new Date('2026-06-18').toISOString(),
      semester: 5,
      downloadUrl: '#'
    },
    {
      id: 'note-002',
      title: 'Process Synchronization',
      subject: 'Operating Systems',
      description: 'Detailed notes on semaphores, mutex, monitors, and classical synchronization problems.',
      fileType: 'pdf',
      uploadedBy: 'admin-001',
      uploadedByName: 'Dr. Sunita Rao',
      uploadedAt: new Date('2026-06-19').toISOString(),
      semester: 5,
      downloadUrl: '#'
    },
    {
      id: 'note-003',
      title: 'SQL – Advanced Queries',
      subject: 'Database Management',
      description: 'Joins, subqueries, views, triggers, stored procedures with examples.',
      fileType: 'pdf',
      uploadedBy: 'admin-001',
      uploadedByName: 'Dr. Priya Sharma',
      uploadedAt: new Date('2026-06-20').toISOString(),
      semester: 5,
      downloadUrl: '#'
    },
    {
      id: 'note-004',
      title: 'OSI vs TCP/IP Model',
      subject: 'Computer Networks',
      description: 'Layer-by-layer comparison, protocols at each layer, real-world packet flow.',
      fileType: 'pdf',
      uploadedBy: 'admin-001',
      uploadedByName: 'Prof. Ramesh Joshi',
      uploadedAt: new Date('2026-06-21').toISOString(),
      semester: 5,
      downloadUrl: '#'
    }
  ]
};

module.exports = db;
