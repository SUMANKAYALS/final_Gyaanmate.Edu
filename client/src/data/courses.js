export const courses = [
  // Medical & Nursing Courses
  {
    id: 1,
    title: "Introduction to Clinical Nursing",
    description: "Learn the fundamentals of clinical nursing practice, patient care, and medical ethics",
    instructor: {
      name: "Dr. Sarah Johnson",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      bio: "15+ years of clinical nursing experience"
    },
    price: 49.99,
    category: "Nursing",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    rating: 4.8,
    students: 2450,
    duration: "8 weeks",
    level: "Beginner",
    reviews: 186,
    lessons: [
      { id: 1, title: "Course Overview", duration: "15 min", videoUrl: "https://example.com/video1" },
      { id: 2, title: "Basic Patient Care", duration: "45 min", videoUrl: "https://example.com/video2" },
      { id: 3, title: "Vital Signs Monitoring", duration: "50 min", videoUrl: "https://example.com/video3" },
      { id: 4, title: "Medical Ethics", duration: "40 min", videoUrl: "https://example.com/video4" }
    ],
    skills: ["Patient Care", "Medical Ethics", "Clinical Documentation", "Communication"],
    description_full: "This comprehensive course covers the fundamental principles of clinical nursing. You'll learn patient care techniques, vital signs monitoring, medical ethics, and proper documentation practices."
  },
  {
    id: 2,
    title: "Pharmacology Essentials",
    description: "Master drug interactions, dosages, and pharmaceutical concepts for healthcare professionals",
    instructor: {
      name: "Prof. Michael Chen",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      bio: "PhD in Pharmacology, 12 years teaching experience"
    },
    price: 59.99,
    category: "Pharmacology",
    image: "https://images.unsplash.com/photo-1631217314830-6db80ce52056?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    rating: 4.7,
    students: 1890,
    duration: "10 weeks",
    level: "Intermediate",
    reviews: 142,
    lessons: [
      { id: 1, title: "Introduction to Pharmacology", duration: "30 min", videoUrl: "https://example.com/video1" },
      { id: 2, title: "Drug Classifications", duration: "55 min", videoUrl: "https://example.com/video2" },
      { id: 3, title: "Dosage Calculations", duration: "50 min", videoUrl: "https://example.com/video3" },
      { id: 4, title: "Drug Interactions & Side Effects", duration: "60 min", videoUrl: "https://example.com/video4" },
      { id: 5, title: "Case Studies", duration: "45 min", videoUrl: "https://example.com/video5" }
    ],
    skills: ["Drug Classification", "Dosage Calculation", "Patient Safety", "Clinical Application"],
    description_full: "Deep dive into pharmaceutical science. Learn about drug mechanisms, interactions, side effects, and how to calculate proper dosages for different patient populations."
  },
  {
    id: 3,
    title: "Medical Devices & Equipment",
    description: "Comprehensive guide to medical equipment operation and maintenance",
    instructor: {
      name: "James Wilson",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      bio: "20 years in medical device industry"
    },
    price: 44.99,
    category: "Medical Devices",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    rating: 4.6,
    students: 1560,
    duration: "6 weeks",
    level: "Beginner",
    reviews: 124,
    lessons: [
      { id: 1, title: "Types of Medical Devices", duration: "40 min", videoUrl: "https://example.com/video1" },
      { id: 2, title: "Safety Protocols", duration: "50 min", videoUrl: "https://example.com/video2" },
      { id: 3, title: "Equipment Maintenance", duration: "45 min", videoUrl: "https://example.com/video3" },
      { id: 4, title: "Troubleshooting Guide", duration: "55 min", videoUrl: "https://example.com/video4" }
    ],
    skills: ["Equipment Operation", "Safety Protocols", "Maintenance", "Troubleshooting"],
    description_full: "Learn to operate and maintain critical medical devices. This course covers patient monitors, ventilators, infusion pumps, and other essential equipment."
  },
  {
    id: 4,
    title: "First Aid & Emergency Response",
    description: "Essential first aid techniques and emergency response procedures",
    instructor: {
      name: "Emma Rodriguez",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      bio: "Certified EMT, 10 years emergency experience"
    },
    price: 34.99,
    category: "Emergency Care",
    image: "https://images.unsplash.com/photo-1579154204601-01d82f60b1db?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    rating: 4.9,
    students: 3200,
    duration: "4 weeks",
    level: "Beginner",
    reviews: 289,
    lessons: [
      { id: 1, title: "CPR Basics", duration: "35 min", videoUrl: "https://example.com/video1" },
      { id: 2, title: "Wound Care & Bleeding Control", duration: "40 min", videoUrl: "https://example.com/video2" },
      { id: 3, title: "Fracture & Burn Management", duration: "45 min", videoUrl: "https://example.com/video3" },
      { id: 4, title: "Emergency Response Protocols", duration: "50 min", videoUrl: "https://example.com/video4" }
    ],
    skills: ["CPR", "Wound Care", "Emergency Response", "Patient Stabilization"],
    description_full: "Master life-saving first aid techniques. This practical course teaches CPR, wound care, fracture management, and proper emergency response procedures."
  },
  {
    id: 5,
    title: "Baby & Maternal Health Care",
    description: "Specialized care for mothers and newborns during pregnancy, labor, and postpartum",
    instructor: {
      name: "Dr. Lisa Anderson",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      bio: "OB/GYN specialist, 18 years experience"
    },
    price: 54.99,
    category: "Maternal Health",
    image: "https://images.unsplash.com/photo-1631217314830-6db80ce52056?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    rating: 4.8,
    students: 2100,
    duration: "9 weeks",
    level: "Intermediate",
    reviews: 167,
    lessons: [
      { id: 1, title: "Pregnancy Care Basics", duration: "50 min", videoUrl: "https://example.com/video1" },
      { id: 2, title: "Labor & Delivery Procedures", duration: "60 min", videoUrl: "https://example.com/video2" },
      { id: 3, title: "Postpartum Care", duration: "45 min", videoUrl: "https://example.com/video3" },
      { id: 4, title: "Newborn Care & Development", duration: "55 min", videoUrl: "https://example.com/video4" },
      { id: 5, title: "Complications & Emergency Care", duration: "60 min", videoUrl: "https://example.com/video5" }
    ],
    skills: ["Prenatal Care", "Delivery Assistance", "Postpartum Support", "Newborn Care"],
    description_full: "Complete guide to maternal and baby healthcare. Learn about prenatal care, labor management, postpartum recovery, and newborn development."
  },
  {
    id: 6,
    title: "Personal Care & Wellness",
    description: "Holistic approach to personal health, nutrition, and wellness management",
    instructor: {
      name: "Dr. Robert Turner",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      bio: "Nutritionist and wellness coach, 15 years expertise"
    },
    price: 39.99,
    category: "Wellness",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    rating: 4.7,
    students: 1670,
    duration: "7 weeks",
    level: "Beginner",
    reviews: 133,
    lessons: [
      { id: 1, title: "Nutrition Fundamentals", duration: "45 min", videoUrl: "https://example.com/video1" },
      { id: 2, title: "Exercise & Fitness", duration: "50 min", videoUrl: "https://example.com/video2" },
      { id: 3, title: "Mental Health & Stress Management", duration: "40 min", videoUrl: "https://example.com/video3" },
      { id: 4, title: "Sleep & Recovery", duration: "35 min", videoUrl: "https://example.com/video4" }
    ],
    skills: ["Nutrition Planning", "Fitness Guidance", "Stress Management", "Wellness Coaching"],
    description_full: "Learn comprehensive personal wellness. Topics include nutrition, exercise, mental health, and creating sustainable lifestyle changes."
  }
];

// Course categories
export const courseCategories = [
  { name: "Nursing", icon: "🏥", count: 45 },
  { name: "Pharmacology", icon: "💊", count: 32 },
  { name: "Medical Devices", icon: "🔧", count: 28 },
  { name: "Emergency Care", icon: "🚑", count: 18 },
  { name: "Maternal Health", icon: "👶", count: 25 },
  { name: "Wellness", icon: "💪", count: 35 }
];
