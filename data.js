/**
 * StudyStream Data Module
 * Handles all data for the application, including courses and user progress
 */

const studyStreamData = (function() {
  // Sample courses data
  const courses = [
    {
      id: "course-1",
      title: "Introduction to Web Development",
      description: "Learn the fundamentals of web development including HTML, CSS, and JavaScript.",
      instructor: "Sarah Johnson",
      thumbnail: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=800",
      rating: 4.8,
      enrolledCount: 2345,
      category: "Programming",
      lastUpdated: "2024-01-15",
      about: "This comprehensive course covers everything you need to know to get started with web development. From the basics of HTML and CSS to interactive JavaScript applications, you'll learn through hands-on projects and real-world examples.",
      learningObjectives: [
        "Understand HTML structure and semantics",
        "Style websites using CSS and responsive design principles",
        "Create interactive web pages with JavaScript",
        "Build and deploy your first website"
      ],
      requirements: [
        "No prior programming experience required",
        "Basic computer skills",
        "A computer with internet access"
      ],
      targetAudience: "This course is perfect for absolute beginners who want to start a career in web development or add web development skills to their toolkit.",
      lessons: [
        {
          id: "lesson-1-1",
          title: "Getting Started with HTML",
          description: "Learn the basics of HTML, including elements, attributes, and document structure.",
          duration: "15:30",
          videoUrl: "https://www.youtube.com/embed/UB1O30fR-EE",
          resources: [
            { name: "HTML Cheat Sheet", url: "#" },
            { name: "Practice Exercises", url: "#" }
          ],
          hasQuiz: false
        },
        {
          id: "lesson-1-2",
          title: "CSS Fundamentals",
          description: "Explore CSS selectors, properties, and how to style your HTML documents.",
          duration: "18:45",
          videoUrl: "https://www.youtube.com/embed/yfoY53QXEnI",
          resources: [
            { name: "CSS Reference Guide", url: "#" }
          ],
          hasQuiz: false
        },
        {
          id: "lesson-1-3",
          title: "Introduction to JavaScript",
          description: "Learn the basics of JavaScript programming and DOM manipulation.",
          duration: "22:15",
          videoUrl: "https://www.youtube.com/embed/hdI2bqOjy3c",
          resources: [
            { name: "JavaScript Basics PDF", url: "#" },
            { name: "Code Examples", url: "#" }
          ],
          hasQuiz: true,
          quiz: {
            id: "quiz-1-3",
            title: "JavaScript Basics Quiz",
            questions: [
              {
                id: "q1",
                text: "Which of the following is not a JavaScript data type?",
                options: ["String", "Boolean", "Float", "Number"],
                correctOptionIndex: 2
              },
              {
                id: "q2",
                text: "Which method is used to add an element at the end of an array?",
                options: ["push()", "append()", "add()", "insert()"],
                correctOptionIndex: 0
              },
              {
                id: "q3",
                text: "What will console.log(1 + '2') output?",
                options: ["3", "'12'", "12", "Error"],
                correctOptionIndex: 1
              }
            ]
          }
        },
        {
          id: "lesson-1-4",
          title: "Responsive Web Design",
          description: "Learn how to create websites that look good on all devices.",
          duration: "25:10",
          videoUrl: "https://www.youtube.com/embed/3tLb3i7GB38",
          resources: [
            { name: "Responsive Design Patterns", url: "#" }
          ],
          hasQuiz: true,
          quiz: {
            id: "quiz-1-4",
            title: "Responsive Design Quiz",
            questions: [
              {
                id: "q1",
                text: "What CSS feature is primarily used for creating responsive layouts?",
                options: ["Media Queries", "Animations", "Variables", "Selectors"],
                correctOptionIndex: 0
              },
              {
                id: "q2",
                text: "Which unit is relative to the viewport width?",
                options: ["px", "em", "vw", "rem"],
                correctOptionIndex: 2
              },
              {
                id: "q3",
                text: "What is the purpose of the meta viewport tag?",
                options: [
                  "To set the page background color",
                  "To control the website's SEO",
                  "To control layout on mobile browsers",
                  "To define website metadata"
                ],
                correctOptionIndex: 2
              }
            ]
          }
        }
      ]
    },
    {
      id: "course-2",
      title: "Data Science Fundamentals",
      description: "Master the basics of data science, statistics, and data visualization.",
      instructor: "David Kim",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
      rating: 4.7,
      enrolledCount: 1856,
      category: "Data Science",
      lastUpdated: "2023-12-28",
      about: "This course introduces you to the exciting world of data science. Learn how to analyze data, extract meaningful insights, and create compelling visualizations to communicate your findings.",
      learningObjectives: [
        "Understand fundamental statistical concepts",
        "Clean and preprocess data for analysis",
        "Create meaningful data visualizations",
        "Apply basic machine learning algorithms"
      ],
      requirements: [
        "Basic understanding of mathematics",
        "No programming experience required, but helpful",
        "A computer with internet access"
      ],
      targetAudience: "Aspiring data scientists, analysts, or anyone interested in learning how to work with and understand data.",
      lessons: [
        {
          id: "lesson-2-1",
          title: "Introduction to Data Science",
          description: "Understand what data science is and the role of a data scientist.",
          duration: "20:15",
          videoUrl: "https://www.youtube.com/embed/X3paOmcrTjQ",
          resources: [
            { name: "Data Science Overview", url: "#" }
          ],
          hasQuiz: false
        },
        {
          id: "lesson-2-2",
          title: "Statistics Fundamentals",
          description: "Learn basic statistical concepts essential for data analysis.",
          duration: "28:45",
          videoUrl: "https://www.youtube.com/embed/xxpc-HPKN28",
          resources: [
            { name: "Statistics Cheat Sheet", url: "#" },
            { name: "Practice Problems", url: "#" }
          ],
          hasQuiz: true,
          quiz: {
            id: "quiz-2-2",
            title: "Statistics Fundamentals Quiz",
            questions: [
              {
                id: "q1",
                text: "What measure represents the middle value in a dataset?",
                options: ["Mean", "Median", "Mode", "Range"],
                correctOptionIndex: 1
              },
              {
                id: "q2",
                text: "Which measure is most affected by outliers?",
                options: ["Mean", "Median", "Mode", "Interquartile Range"],
                correctOptionIndex: 0
              },
              {
                id: "q3",
                text: "Standard deviation measures what aspect of a dataset?",
                options: ["Central tendency", "Dispersion", "Correlation", "Size"],
                correctOptionIndex: 1
              }
            ]
          }
        },
        {
          id: "lesson-2-3",
          title: "Data Visualization Techniques",
          description: "Learn how to create effective visualizations to communicate insights.",
          duration: "24:30",
          videoUrl: "https://www.youtube.com/embed/5Zg-C8AAIGg",
          resources: [
            { name: "Visualization Best Practices", url: "#" }
          ],
          hasQuiz: false
        }
      ]
    },
    {
      id: "course-3",
      title: "Digital Marketing Masterclass",
      description: "Learn modern digital marketing strategies to grow your business or brand.",
      instructor: "Emma Rodriguez",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
      rating: 4.9,
      enrolledCount: 3201,
      category: "Marketing",
      lastUpdated: "2024-02-05",
      about: "This course covers everything you need to know about digital marketing, from social media strategies to SEO, content marketing, and paid advertising campaigns.",
      learningObjectives: [
        "Create effective social media marketing campaigns",
        "Understand search engine optimization (SEO) principles",
        "Develop content marketing strategies",
        "Analyze marketing metrics and improve ROI"
      ],
      requirements: [
        "No prior marketing experience required",
        "Interest in digital marketing",
        "A computer with internet access"
      ],
      targetAudience: "Entrepreneurs, marketing professionals, small business owners, and anyone interested in promoting products or services online.",
      lessons: [
        {
          id: "lesson-3-1",
          title: "Introduction to Digital Marketing",
          description: "Understand the digital marketing landscape and key channels.",
          duration: "16:20",
          videoUrl: "https://www.youtube.com/embed/Qw94SRK2MbI",
          resources: [
            { name: "Digital Marketing Framework", url: "#" }
          ],
          hasQuiz: false
        },
        {
          id: "lesson-3-2",
          title: "Social Media Marketing",
          description: "Learn effective strategies for major social media platforms.",
          duration: "32:15",
          videoUrl: "https://www.youtube.com/embed/q8LdGV7gJd4",
          resources: [
            { name: "Platform-specific Best Practices", url: "#" },
            { name: "Content Calendar Template", url: "#" }
          ],
          hasQuiz: true,
          quiz: {
            id: "quiz-3-2",
            title: "Social Media Marketing Quiz",
            questions: [
              {
                id: "q1",
                text: "Which platform is best known for B2B marketing?",
                options: ["Instagram", "TikTok", "LinkedIn", "Pinterest"],
                correctOptionIndex: 2
              },
              {
                id: "q2",
                text: "What is engagement rate?",
                options: [
                  "The percentage of your audience that sees your content",
                  "The percentage of your audience that interacts with your content",
                  "The percentage of conversions from your content",
                  "The frequency of posting content"
                ],
                correctOptionIndex: 1
              },
              {
                id: "q3",
                text: "What type of content typically performs best on Instagram?",
                options: ["Text-heavy posts", "Long-form videos", "Visual content", "Audio content"],
                correctOptionIndex: 2
              }
            ]
          }
        }
      ]
    },
    {
      id: "course-4",
      title: "UX/UI Design Principles",
      description: "Learn the fundamentals of user experience and interface design.",
      instructor: "Michael Chen",
      thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
      rating: 4.6,
      enrolledCount: 1423,
      category: "Design",
      lastUpdated: "2024-01-21",
      lessons: [
        {
          id: "lesson-4-1",
          title: "Introduction to UX/UI Design",
          description: "Understand the difference between UX and UI design.",
          duration: "18:45",
          videoUrl: "https://www.youtube.com/embed/v6n-4-4va4U",
          hasQuiz: false
        },
        {
          id: "lesson-4-2",
          title: "User Research Methods",
          description: "Learn different techniques for understanding user needs.",
          duration: "26:30",
          videoUrl: "https://www.youtube.com/embed/bAARmsv1tms",
          hasQuiz: true,
          quiz: {
            id: "quiz-4-2",
            title: "User Research Quiz",
            questions: [
              {
                id: "q1",
                text: "Which research method involves observing users in their natural environment?",
                options: ["Surveys", "Ethnographic Research", "A/B Testing", "Focus Groups"],
                correctOptionIndex: 1
              },
              {
                id: "q2",
                text: "What is a user persona?",
                options: [
                  "A fictional representation of your ideal user",
                  "A real person who tests your product",
                  "A marketing demographic",
                  "A project stakeholder"
                ],
                correctOptionIndex: 0
              }
            ]
          }
        }
      ]
    }
  ];

  // Local storage functions
  const saveToStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const getFromStorage = (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  };

  // User functions
  const getCurrentUser = () => {
    return getFromStorage('currentUser');
  };

  const getUserProgress = () => {
    const user = getCurrentUser();
    if (!user) return null;
    
    let progress = getFromStorage(`progress_${user.id}`);
    if (!progress) {
      progress = {
        completedLessons: {},
        quizScores: {},
        lastAccessed: {}
      };
      saveToStorage(`progress_${user.id}`, progress);
    }
    return progress;
  };

  const updateUserProgress = (progressData) => {
    const user = getCurrentUser();
    if (!user) return false;
    saveToStorage(`progress_${user.id}`, progressData);
    return true;
  };

  // Course functions
  const getAllCourses = () => {
    return courses;
  };

  const getCourseById = (courseId) => {
    return courses.find(course => course.id === courseId) || null;
  };

  const getPopularCourses = () => {
    return [...courses].sort((a, b) => b.enrolledCount - a.enrolledCount);
  };

  const searchCourses = (query) => {
    if (!query) return [];
    query = query.toLowerCase();
    return courses.filter(course => 
      course.title.toLowerCase().includes(query) || 
      course.instructor.toLowerCase().includes(query) ||
      course.category.toLowerCase().includes(query)
    );
  };

  // Get all unique categories
  const getCategories = () => {
    return [...new Set(courses.map(course => course.category))];
  };

  // Progress tracking functions
  const markLessonComplete = (courseId, lessonId) => {
    const user = getCurrentUser();
    if (!user) return false;
    
    const progress = getUserProgress();
    if (!progress) return false;
    
    if (!progress.completedLessons[courseId]) {
      progress.completedLessons[courseId] = [];
    }
    
    if (!progress.completedLessons[courseId].includes(lessonId)) {
      progress.completedLessons[courseId].push(lessonId);
      return updateUserProgress(progress);
    }
    
    return true;
  };

  const isLessonComplete = (courseId, lessonId) => {
    const progress = getUserProgress();
    if (!progress || !progress.completedLessons[courseId]) return false;
    return progress.completedLessons[courseId].includes(lessonId);
  };

  const saveQuizScore = (courseId, quizId, score) => {
    const progress = getUserProgress();
    if (!progress) return false;
    
    if (!progress.quizScores[courseId]) {
      progress.quizScores[courseId] = {};
    }
    
    progress.quizScores[courseId][quizId] = score;
    return updateUserProgress(progress);
  };

  const getQuizScore = (courseId, quizId) => {
    const progress = getUserProgress();
    if (!progress || !progress.quizScores[courseId]) return null;
    return progress.quizScores[courseId][quizId] || null;
  };

  const updateLastAccessedLesson = (courseId, lessonId) => {
    const progress = getUserProgress();
    if (!progress) return false;
    
    if (!progress.lastAccessed) {
      progress.lastAccessed = {};
    }
    
    progress.lastAccessed[courseId] = lessonId;
    return updateUserProgress(progress);
  };

  const getLastAccessedLesson = (courseId) => {
    const progress = getUserProgress();
    if (!progress || !progress.lastAccessed) return null;
    return progress.lastAccessed[courseId] || null;
  };

  const calculateCourseProgress = (courseId) => {
    const course = getCourseById(courseId);
    if (!course) return 0;
    
    const progress = getUserProgress();
    if (!progress || !progress.completedLessons[courseId]) return 0;
    
    const totalLessons = course.lessons.length;
    const completedLessons = progress.completedLessons[courseId].length;
    
    return Math.round((completedLessons / totalLessons) * 100);
  };

  // Get enrolled courses
  const getEnrolledCourses = () => {
    const user = getCurrentUser();
    if (!user || !user.enrolledCourses) return [];
    
    return courses.filter(course => user.enrolledCourses.includes(course.id));
  };

  const enrollInCourse = (courseId) => {
    const user = getCurrentUser();
    if (!user) return false;
    
    if (!user.enrolledCourses) {
      user.enrolledCourses = [];
    }
    
    if (!user.enrolledCourses.includes(courseId)) {
      user.enrolledCourses.push(courseId);
      saveToStorage('currentUser', user);
      return true;
    }
    
    return false;
  };

  const isEnrolled = (courseId) => {
    const user = getCurrentUser();
    if (!user || !user.enrolledCourses) return false;
    return user.enrolledCourses.includes(courseId);
  };

  // Public API
  return {
    // User functions
    getCurrentUser,
    getUserProgress,
    
    // Course functions
    getAllCourses,
    getCourseById,
    getPopularCourses,
    searchCourses,
    getCategories,
    
    // Progress tracking
    markLessonComplete,
    isLessonComplete,
    saveQuizScore,
    getQuizScore,
    updateLastAccessedLesson,
    getLastAccessedLesson,
    calculateCourseProgress,
    
    // Enrollment
    getEnrolledCourses,
    enrollInCourse,
    isEnrolled
  };
})();
