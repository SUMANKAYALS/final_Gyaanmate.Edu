/** Course templates — at least 2 per category for global learning platform */
export const courseTemplates = [
  // Programming
  { title: 'Python for Everybody', category: 'Programming', tags: ['python', 'programming'], level: 'Beginner', price: 39.99, rating: 4.9, students: 22000 },
  { title: 'Java Programming Masterclass', category: 'Programming', tags: ['java', 'oop'], level: 'Beginner', price: 44.99, rating: 4.7, students: 15000 },
  { title: 'C++ Programming from Zero to Hero', category: 'Programming', tags: ['c++', 'programming'], level: 'Intermediate', price: 49.99, rating: 4.6, students: 8900 },
  { title: 'Go (Golang) Complete Developer Course', category: 'Programming', tags: ['golang', 'backend'], level: 'Intermediate', price: 54.99, rating: 4.8, students: 7200 },
  { title: 'JavaScript Algorithms & Data Structures', category: 'Programming', tags: ['javascript', 'dsa'], level: 'Intermediate', price: 54.99, rating: 4.9, students: 10200 },
  { title: 'Kubernetes & Docker DevOps', category: 'Programming', tags: ['docker', 'kubernetes'], level: 'Advanced', price: 69.99, rating: 4.7, students: 3600 },
  { title: 'React Native - Build Mobile Apps', category: 'Programming', tags: ['react native', 'mobile'], level: 'Intermediate', price: 54.99, rating: 4.7, students: 8200 },
  // Web Development
  { title: 'Complete React Developer Bootcamp', category: 'Web Development', tags: ['react', 'frontend'], level: 'Beginner', price: 49.99, rating: 4.9, students: 12500 },
  { title: 'Next.js 14 Full Stack Masterclass', category: 'Web Development', tags: ['next.js', 'react'], level: 'Intermediate', price: 59.99, rating: 4.8, students: 9100 },
  { title: 'MERN Stack Complete Guide', category: 'Web Development', tags: ['mern', 'full stack'], level: 'Intermediate', price: 64.99, rating: 4.8, students: 7800 },
  { title: 'HTML, CSS & JavaScript Web Fundamentals', category: 'Web Development', tags: ['html', 'css', 'javascript'], level: 'Beginner', price: 29.99, rating: 4.8, students: 18500 },
  { title: 'Vue.js 3 - Complete Guide', category: 'Web Development', tags: ['vue', 'frontend'], level: 'Intermediate', price: 47.99, rating: 4.7, students: 6500 },
  // AI & Machine Learning
  { title: 'AI & Machine Learning A-Z', category: 'AI & Machine Learning', tags: ['ai', 'machine learning'], level: 'Beginner', price: 69.99, rating: 4.8, students: 15600 },
  { title: 'Deep Learning with PyTorch', category: 'AI & Machine Learning', tags: ['pytorch', 'deep learning'], level: 'Advanced', price: 74.99, rating: 4.7, students: 5400 },
  { title: 'Natural Language Processing with Python', category: 'AI & Machine Learning', tags: ['nlp', 'python'], level: 'Advanced', price: 79.99, rating: 4.8, students: 4800 },
  { title: 'Computer Vision with OpenCV', category: 'AI & Machine Learning', tags: ['computer vision', 'opencv'], level: 'Intermediate', price: 64.99, rating: 4.6, students: 3900 },
  { title: 'ChatGPT & Prompt Engineering', category: 'AI & Machine Learning', tags: ['chatgpt', 'llm', 'prompt'], level: 'Beginner', price: 34.99, rating: 4.9, students: 21000 },
  // Cyber Security
  { title: 'Cyber Security Fundamentals', category: 'Cyber Security', tags: ['security', 'network'], level: 'Beginner', price: 44.99, rating: 4.6, students: 6800 },
  { title: 'Ethical Hacking Complete Course', category: 'Cyber Security', tags: ['ethical hacking', 'penetration'], level: 'Advanced', price: 79.99, rating: 4.8, students: 4200 },
  { title: 'Network Security & Firewalls', category: 'Cyber Security', tags: ['network', 'firewall'], level: 'Intermediate', price: 52.99, rating: 4.5, students: 3100 },
  // Data Science
  { title: 'Data Science with Python & Pandas', category: 'Data Science', tags: ['pandas', 'python'], level: 'Beginner', price: 49.99, rating: 4.7, students: 11200 },
  { title: 'SQL for Data Analysis', category: 'Data Science', tags: ['sql', 'analytics'], level: 'Beginner', price: 34.99, rating: 4.6, students: 9800 },
  { title: 'Power BI Data Visualization', category: 'Data Science', tags: ['power bi', 'visualization'], level: 'Beginner', price: 39.99, rating: 4.7, students: 7600 },
  { title: 'R Programming for Data Science', category: 'Data Science', tags: ['r', 'statistics'], level: 'Intermediate', price: 44.99, rating: 4.5, students: 4200 },
  // Medical & Healthcare
  { title: 'Clinical Nursing Fundamentals', category: 'Medical & Healthcare', tags: ['nursing', 'clinical'], level: 'Beginner', price: 49.99, rating: 4.8, students: 3200 },
  { title: 'Pharmacology Essentials', category: 'Medical & Healthcare', tags: ['pharmacology', 'medicine'], level: 'Intermediate', price: 59.99, rating: 4.7, students: 2800 },
  { title: 'First Aid & Emergency Response', category: 'Medical & Healthcare', tags: ['first aid', 'emergency'], level: 'Beginner', price: 34.99, rating: 4.9, students: 5100 },
  // Business & Finance
  { title: 'Financial Accounting Basics', category: 'Business & Finance', tags: ['accounting', 'finance'], level: 'Beginner', price: 39.99, rating: 4.5, students: 4800 },
  { title: 'Stock Market Investing for Beginners', category: 'Business & Finance', tags: ['stocks', 'investing'], level: 'Beginner', price: 44.99, rating: 4.6, students: 9200 },
  { title: 'Microsoft Excel for Business', category: 'Business & Finance', tags: ['excel', 'business'], level: 'Beginner', price: 29.99, rating: 4.8, students: 14000 },
  { title: 'Entrepreneurship & Startup Basics', category: 'Business & Finance', tags: ['startup', 'business'], level: 'All Levels', price: 49.99, rating: 4.7, students: 6800 },
  // Graphic Design
  { title: 'UI/UX Design with Figma', category: 'Graphic Design', tags: ['figma', 'ui', 'ux'], level: 'Beginner', price: 39.99, rating: 4.8, students: 7600 },
  { title: 'Adobe Photoshop Complete Course', category: 'Graphic Design', tags: ['photoshop', 'design'], level: 'Beginner', price: 44.99, rating: 4.7, students: 5900 },
  { title: 'Adobe Illustrator for Beginners', category: 'Graphic Design', tags: ['illustrator', 'vector'], level: 'Beginner', price: 42.99, rating: 4.6, students: 4100 },
  // Video Editing
  { title: 'Adobe Premiere Pro Video Editing', category: 'Video Editing', tags: ['premiere', 'editing'], level: 'Intermediate', price: 49.99, rating: 4.6, students: 5100 },
  { title: 'DaVinci Resolve Color Grading', category: 'Video Editing', tags: ['davinci', 'color'], level: 'Intermediate', price: 47.99, rating: 4.7, students: 3800 },
  { title: 'After Effects Motion Graphics', category: 'Video Editing', tags: ['after effects', 'motion'], level: 'Advanced', price: 54.99, rating: 4.8, students: 4500 },
  // Language Learning
  { title: 'Spanish for Beginners', category: 'Language Learning', tags: ['spanish', 'language'], level: 'Beginner', price: 29.99, rating: 4.7, students: 6400 },
  { title: 'English Speaking Fluency Course', category: 'Language Learning', tags: ['english', 'speaking'], level: 'Beginner', price: 34.99, rating: 4.8, students: 11200 },
  { title: 'Japanese for Beginners (JLPT N5)', category: 'Language Learning', tags: ['japanese', 'jlpt'], level: 'Beginner', price: 39.99, rating: 4.7, students: 5200 },
  { title: 'French Language Complete Course', category: 'Language Learning', tags: ['french', 'language'], level: 'Beginner', price: 32.99, rating: 4.6, students: 4800 },
  // School/College Education
  { title: 'High School Mathematics Complete', category: 'School/College Education', tags: ['math', 'algebra'], level: 'Beginner', price: 24.99, rating: 4.8, students: 8900 },
  { title: 'Chemistry for Class 11 & 12', category: 'School/College Education', tags: ['chemistry', 'science'], level: 'Intermediate', price: 34.99, rating: 4.7, students: 6100 },
  { title: 'Biology Fundamentals for Students', category: 'School/College Education', tags: ['biology', 'science'], level: 'Beginner', price: 29.99, rating: 4.6, students: 5400 },
  // Competitive Exams
  { title: 'JEE & NEET Physics Crash Course', category: 'Competitive Exams', tags: ['jee', 'neet', 'physics'], level: 'Intermediate', price: 59.99, rating: 4.9, students: 4500 },
  { title: 'UPSC Civil Services Preparation', category: 'Competitive Exams', tags: ['upsc', 'ias'], level: 'Advanced', price: 89.99, rating: 4.8, students: 3200 },
  { title: 'GATE Computer Science Prep', category: 'Competitive Exams', tags: ['gate', 'cs'], level: 'Advanced', price: 69.99, rating: 4.7, students: 2800 },
  { title: 'CAT MBA Entrance Preparation', category: 'Competitive Exams', tags: ['cat', 'mba'], level: 'Advanced', price: 74.99, rating: 4.6, students: 2400 },
  // Music & Arts
  { title: 'Guitar Lessons for Beginners', category: 'Music & Arts', tags: ['guitar', 'music'], level: 'Beginner', price: 24.99, rating: 4.8, students: 3800 },
  { title: 'Piano for Beginners', category: 'Music & Arts', tags: ['piano', 'music'], level: 'Beginner', price: 29.99, rating: 4.7, students: 4200 },
  { title: 'Drawing & Sketching Fundamentals', category: 'Music & Arts', tags: ['drawing', 'art'], level: 'Beginner', price: 27.99, rating: 4.6, students: 3500 },
  // Marketing
  { title: 'Digital Marketing Masterclass', category: 'Marketing', tags: ['digital marketing', 'seo'], level: 'Beginner', price: 44.99, rating: 4.7, students: 8900 },
  { title: 'Social Media Marketing 2024', category: 'Marketing', tags: ['social media', 'instagram'], level: 'Beginner', price: 39.99, rating: 4.8, students: 10200 },
  { title: 'Google Ads & PPC Advertising', category: 'Marketing', tags: ['google ads', 'ppc'], level: 'Intermediate', price: 49.99, rating: 4.6, students: 5600 },
  // Photography
  { title: 'Photography Masterclass', category: 'Photography', tags: ['photography', 'camera'], level: 'All Levels', price: 44.99, rating: 4.7, students: 6200 },
  { title: 'Lightroom Photo Editing', category: 'Photography', tags: ['lightroom', 'editing'], level: 'Beginner', price: 36.99, rating: 4.8, students: 4800 },
  { title: 'Portrait Photography Techniques', category: 'Photography', tags: ['portrait', 'photography'], level: 'Intermediate', price: 42.99, rating: 4.7, students: 3900 },
  // Fitness
  { title: 'Home Workout & Fitness Program', category: 'Fitness', tags: ['fitness', 'workout'], level: 'Beginner', price: 19.99, rating: 4.6, students: 9100 },
  { title: 'Yoga for Beginners', category: 'Fitness', tags: ['yoga', 'wellness'], level: 'Beginner', price: 24.99, rating: 4.8, students: 7800 },
  { title: 'Nutrition & Diet Planning', category: 'Fitness', tags: ['nutrition', 'health'], level: 'Beginner', price: 29.99, rating: 4.7, students: 6500 },
  // Personal Development
  { title: 'Productivity & Time Management', category: 'Personal Development', tags: ['productivity', 'habits'], level: 'All Levels', price: 29.99, rating: 4.8, students: 11500 },
  { title: 'Public Speaking & Presentation Skills', category: 'Personal Development', tags: ['public speaking', 'communication'], level: 'Beginner', price: 34.99, rating: 4.7, students: 7200 },
  { title: 'Leadership & Management Skills', category: 'Personal Development', tags: ['leadership', 'management'], level: 'Intermediate', price: 44.99, rating: 4.6, students: 5800 },
];
