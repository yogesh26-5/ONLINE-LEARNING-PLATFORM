/**
 * StudyStream Course Detail Page
 * Handles course viewing, lessons, and quizzes
 */

document.addEventListener('DOMContentLoaded', function() {
  // Get course ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get('id');
  
  if (!courseId) {
    window.location.href = 'courses.html';
    return;
  }
  
  // Get course data
  const course = studyStreamData.getCourseById(courseId);
  
  if (!course) {
    window.location.href = 'courses.html';
    return;
  }
  
  // Get user information
  const user = studyStreamData.getCurrentUser();
  const isUserEnrolled = user && studyStreamData.isEnrolled(courseId);
  
  // DOM elements
  const courseTitle = document.getElementById('course-title');
  const courseBreadcrumbTitle = document.getElementById('course-breadcrumb-title');
  const courseDescription = document.getElementById('course-description');
  const courseCategory = document.getElementById('course-category');
  const courseInstructor = document.getElementById('course-instructor');
  const courseRating = document.getElementById('course-rating');
  const enrolledCount = document.getElementById('enrolled-count');
  const lessonCount = document.getElementById('lesson-count');
  const courseDuration = document.getElementById('course-duration');
  const lastUpdated = document.getElementById('last-updated');
  const lessonList = document.getElementById('lesson-list');
  const enrollBtn = document.getElementById('enroll-btn');
  const loginPrompt = document.getElementById('login-prompt');
  const progressContainer = document.getElementById('progress-container');
  const progressCircle = document.getElementById('progress-circle');
  const progressPercentage = document.getElementById('progress-percentage');
  const videoContainer = document.getElementById('video-container');
  const quizContainer = document.getElementById('quiz-container');
  const lessonTitle = document.getElementById('lesson-title');
  const lessonDescription = document.getElementById('lesson-description');
  const prevLessonBtn = document.getElementById('prev-lesson-btn');
  const nextLessonBtn = document.getElementById('next-lesson-btn');
  const markCompleteBtn = document.getElementById('mark-complete-btn');
  const startQuizBtn = document.getElementById('start-quiz-btn');
  const lessonResources = document.getElementById('lesson-resources');
  const resourcesList = document.getElementById('resources-list');
  const courseAbout = document.getElementById('course-about');
  const learningObjectives = document.getElementById('learning-objectives');
  const courseRequirements = document.getElementById('course-requirements');
  const targetAudience = document.getElementById('target-audience');
  const curriculumAccordion = document.getElementById('curriculum-accordion');
  
  // State variables
  let currentLessonIndex = 0;
  let videoPlayer = null;
  
  // Initialize the page
  init();
  
  function init() {
    // Fill in course details
    populateCourseDetails();
    
    // Set up lesson list
    populateLessonList();
    
    // Set up curriculum section
    populateCurriculum();
    
    // Set up course tabs content
    populateCourseTabsContent();
    
    // Set up enrollment button
    setupEnrollmentButton();
    
    // Handle user authentication state changes
    document.addEventListener('authStateChanged', function(event) {
      const user = event.detail.user;
      updateUIForAuthState(user);
    });
    
    // Show first lesson by default or last accessed lesson if available
    if (user && studyStreamData.isEnrolled(courseId)) {
      const lastAccessedLessonId = studyStreamData.getLastAccessedLesson(courseId);
      if (lastAccessedLessonId) {
        const lessonIndex = course.lessons.findIndex(lesson => lesson.id === lastAccessedLessonId);
        if (lessonIndex !== -1) {
          currentLessonIndex = lessonIndex;
        }
      }
    }
    
    loadLesson(currentLessonIndex);
  }
  
  function populateCourseDetails() {
    // Page title
    document.title = `${course.title} | StudyStream`;
    
    // Basic course info
    if (courseTitle) courseTitle.textContent = course.title;
    if (courseBreadcrumbTitle) courseBreadcrumbTitle.textContent = course.title;
    if (courseDescription) courseDescription.textContent = course.description;
    if (courseCategory) courseCategory.textContent = course.category;
    if (courseInstructor) courseInstructor.textContent = course.instructor;
    if (courseRating) courseRating.textContent = course.rating.toFixed(1);
    if (enrolledCount) enrolledCount.textContent = course.enrolledCount.toLocaleString();
    if (lessonCount) lessonCount.textContent = course.lessons.length;
    
    // Calculate total duration
    if (courseDuration) {
      const totalMinutes = course.lessons.reduce((total, lesson) => {
        const [minutes, seconds] = lesson.duration.split(':').map(Number);
        return total + minutes + (seconds / 60);
      }, 0);
      
      const hours = Math.floor(totalMinutes / 60);
      const minutes = Math.floor(totalMinutes % 60);
      
      courseDuration.textContent = hours > 0 
        ? `${hours}h ${minutes}m`
        : `${minutes}m`;
    }
    
    if (lastUpdated) lastUpdated.textContent = `Last updated: ${course.lastUpdated}`;
    
    // Show progress if user is enrolled
    if (user && studyStreamData.isEnrolled(courseId)) {
      const progress = studyStreamData.calculateCourseProgress(courseId);
      
      if (progressContainer) progressContainer.classList.remove('d-none');
      if (progressCircle) {
        progressCircle.style.setProperty('--progress', `${progress}%`);
      }
      if (progressPercentage) progressPercentage.textContent = `${progress}%`;
    }
  }
  
  function populateLessonList() {
    if (!lessonList) return;
    
    course.lessons.forEach((lesson, index) => {
      const isCompleted = user && studyStreamData.isLessonComplete(courseId, lesson.id);
      
      const listItem = document.createElement('a');
      listItem.href = 'javascript:void(0)';
      listItem.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-center';
      listItem.setAttribute('data-lesson-index', index);
      
      listItem.innerHTML = `
        <div class="lesson-item-content">
          <div class="d-flex align-items-center">
            <span class="lesson-number me-2">${index + 1}.</span>
            <span class="lesson-title">${lesson.title}</span>
          </div>
          <div class="small text-muted mt-1">
            <i class="fa-regular fa-clock me-1"></i>${lesson.duration}
          </div>
        </div>
        <div>
          ${isCompleted 
            ? '<i class="fa-solid fa-circle-check text-success"></i>' 
            : '<i class="fa-regular fa-circle text-muted"></i>'
          }
        </div>
      `;
      
      // Add click event to load lesson
      listItem.addEventListener('click', function() {
        loadLesson(index);
      });
      
      lessonList.appendChild(listItem);
    });
  }
  
  function populateCurriculum() {
    if (!curriculumAccordion) return;
    
    // Group lessons by sections
    const lessonGroups = {};
    const sectionPattern = /^(.*?):\s+(.*)$/;
    
    course.lessons.forEach((lesson, index) => {
      const match = lesson.title.match(sectionPattern);
      
      if (match) {
        const sectionName = match[1];
        const actualTitle = match[2];
        
        if (!lessonGroups[sectionName]) {
          lessonGroups[sectionName] = [];
        }
        
        lessonGroups[sectionName].push({
          ...lesson,
          displayTitle: actualTitle,
          index
        });
      } else {
        // For lessons without section in the title
        if (!lessonGroups['Main Content']) {
          lessonGroups['Main Content'] = [];
        }
        
        lessonGroups['Main Content'].push({
          ...lesson,
          displayTitle: lesson.title,
          index
        });
      }
    });
    
    // Create accordion items for each section
    Object.keys(lessonGroups).forEach((sectionName, sectionIndex) => {
      const sectionId = `section-${sectionIndex}`;
      const lessons = lessonGroups[sectionName];
      
      const accordionItem = document.createElement('div');
      accordionItem.className = 'accordion-item';
      
      accordionItem.innerHTML = `
        <h2 class="accordion-header">
          <button class="accordion-button ${sectionIndex > 0 ? 'collapsed' : ''}" type="button" 
                  data-bs-toggle="collapse" data-bs-target="#${sectionId}">
            <span class="fw-bold">${sectionName}</span>
            <span class="ms-auto badge bg-light text-dark me-2">${lessons.length} lessons</span>
          </button>
        </h2>
        <div id="${sectionId}" class="accordion-collapse collapse ${sectionIndex === 0 ? 'show' : ''}" 
             data-bs-parent="#curriculum-accordion">
          <div class="accordion-body p-0">
            <div class="list-group list-group-flush" id="section-lessons-${sectionIndex}">
            </div>
          </div>
        </div>
      `;
      
      curriculumAccordion.appendChild(accordionItem);
      
      // Add lessons to this section
      const sectionLessonsContainer = document.getElementById(`section-lessons-${sectionIndex}`);
      
      lessons.forEach(lesson => {
        const isCompleted = user && studyStreamData.isLessonComplete(courseId, lesson.id);
        
        const lessonItem = document.createElement('a');
        lessonItem.href = 'javascript:void(0)';
        lessonItem.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-center';
        lessonItem.setAttribute('data-lesson-index', lesson.index);
        
        lessonItem.innerHTML = `
          <div class="lesson-item-content">
            <div class="d-flex align-items-center">
              <span class="lesson-title">${lesson.displayTitle}</span>
            </div>
            <div class="small text-muted mt-1">
              <i class="fa-regular fa-clock me-1"></i>${lesson.duration}
              ${lesson.hasQuiz ? '<span class="ms-2"><i class="fa-solid fa-question-circle"></i> Quiz</span>' : ''}
            </div>
          </div>
          <div>
            ${isCompleted 
              ? '<i class="fa-solid fa-circle-check text-success"></i>' 
              : '<i class="fa-regular fa-circle text-muted"></i>'
            }
          </div>
        `;
        
        // Add click event to load lesson
        lessonItem.addEventListener('click', function() {
          loadLesson(lesson.index);
        });
        
        sectionLessonsContainer.appendChild(lessonItem);
      });
    });
  }
  
  function populateCourseTabsContent() {
    // About section
    if (courseAbout && course.about) {
      courseAbout.innerHTML = `<p>${course.about}</p>`;
    }
    
    // Learning objectives
    if (learningObjectives && course.learningObjectives) {
      learningObjectives.innerHTML = course.learningObjectives
        .map(objective => `<li class="list-group-item"><i class="fa-solid fa-check text-success me-2"></i>${objective}</li>`)
        .join('');
    }
    
    // Requirements
    if (courseRequirements && course.requirements) {
      courseRequirements.innerHTML = course.requirements
        .map(req => `<li class="list-group-item"><i class="fa-solid fa-circle-info text-primary me-2"></i>${req}</li>`)
        .join('');
    }
    
    // Target audience
    if (targetAudience && course.targetAudience) {
      targetAudience.innerHTML = `<p>${course.targetAudience}</p>`;
    }
    
    // Set up discussion tab
    const discussionLoginMessage = document.getElementById('discussion-login-message');
    const discussionForm = document.getElementById('discussion-form');
    
    if (discussionLoginMessage && discussionForm) {
      if (user) {
        discussionLoginMessage.classList.add('d-none');
        discussionForm.classList.remove('d-none');
      } else {
        discussionLoginMessage.classList.remove('d-none');
        discussionForm.classList.add('d-none');
      }
    }
  }
  
  function setupEnrollmentButton() {
    if (!enrollBtn || !loginPrompt) return;
    
    // Update the UI based on authentication state
    updateUIForAuthState(user);
    
    // Add enrollment event listener
    enrollBtn.addEventListener('click', function() {
      if (!user) {
        window.location.href = 'auth.html?type=login';
        return;
      }
      
      // Enroll user in the course
      const success = studyStreamData.enrollInCourse(courseId);
      
      if (success) {
        // Update UI
        updateUIForAuthState(studyStreamData.getCurrentUser());
        
        // Show success message
        alert('Successfully enrolled in the course!');
      }
    });
  }
  
  function updateUIForAuthState(user) {
    const isUserEnrolled = user && studyStreamData.isEnrolled(courseId);
    
    if (enrollBtn && loginPrompt) {
      if (!user) {
        // Not logged in
        loginPrompt.classList.remove('d-none');
        enrollBtn.textContent = 'Sign In to Enroll';
      } else if (isUserEnrolled) {
        // Enrolled
        loginPrompt.classList.add('d-none');
        enrollBtn.textContent = 'Enrolled';
        enrollBtn.disabled = true;
        enrollBtn.classList.add('btn-success');
        
        // Show progress
        if (progressContainer) {
          progressContainer.classList.remove('d-none');
          
          const progress = studyStreamData.calculateCourseProgress(courseId);
          if (progressCircle) {
            progressCircle.style.setProperty('--progress', `${progress}%`);
          }
          if (progressPercentage) progressPercentage.textContent = `${progress}%`;
        }
      } else {
        // Logged in but not enrolled
        loginPrompt.classList.add('d-none');
        enrollBtn.textContent = 'Enroll Now';
        enrollBtn.disabled = false;
      }
    }
    
    // Enable/disable lesson content based on enrollment status
    if (!user || !isUserEnrolled) {
      // Lock lessons except the first one
      const lessonItems = document.querySelectorAll('#lesson-list .list-group-item-action');
      if (lessonItems.length > 1) {
        for (let i = 1; i < lessonItems.length; i++) {
          lessonItems[i].classList.add('disabled');
          lessonItems[i].classList.add('text-muted');
          
          // Add lock icon
          const statusIconDiv = lessonItems[i].querySelector('div:last-child');
          if (statusIconDiv) {
            statusIconDiv.innerHTML = '<i class="fa-solid fa-lock text-muted"></i>';
          }
        }
      }
    }
    
    // Update discussion section
    const discussionLoginMessage = document.getElementById('discussion-login-message');
    const discussionForm = document.getElementById('discussion-form');
    
    if (discussionLoginMessage && discussionForm) {
      if (user) {
        discussionLoginMessage.classList.add('d-none');
        discussionForm.classList.remove('d-none');
      } else {
        discussionLoginMessage.classList.remove('d-none');
        discussionForm.classList.add('d-none');
      }
    }
  }
  
  function loadLesson(index) {
    if (index < 0 || index >= course.lessons.length) return;
    
    const user = studyStreamData.getCurrentUser();
    const isUserEnrolled = user && studyStreamData.isEnrolled(courseId);
    
    // Check if user can access this lesson
    if (index > 0 && !isUserEnrolled) {
      alert('Please enroll in this course to access all lessons.');
      return;
    }
    
    currentLessonIndex = index;
    const lesson = course.lessons[index];
    
    // Update navigation buttons
    if (prevLessonBtn) {
      prevLessonBtn.disabled = index === 0;
    }
    
    if (nextLessonBtn) {
      nextLessonBtn.disabled = index === course.lessons.length - 1;
    }
    
    // Update lesson title and description
    if (lessonTitle) lessonTitle.textContent = lesson.title;
    if (lessonDescription) lessonDescription.textContent = lesson.description;
    
    // Update mark complete button
    if (markCompleteBtn && isUserEnrolled) {
      const isCompleted = studyStreamData.isLessonComplete(courseId, lesson.id);
      
      if (isCompleted) {
        markCompleteBtn.textContent = 'Completed';
        markCompleteBtn.disabled = true;
        markCompleteBtn.classList.replace('btn-primary', 'btn-success');
      } else {
        markCompleteBtn.textContent = 'Mark as Complete';
        markCompleteBtn.disabled = false;
        markCompleteBtn.classList.replace('btn-success', 'btn-primary');
      }
    }
    
    // Show/hide quiz button
    if (startQuizBtn) {
      if (lesson.hasQuiz) {
        startQuizBtn.classList.remove('d-none');
        
        // Add click event
        startQuizBtn.onclick = function() {
          showQuiz(lesson.quiz);
        };
      } else {
        startQuizBtn.classList.add('d-none');
      }
    }
    
    // Update resources
    if (lessonResources && resourcesList) {
      if (lesson.resources && lesson.resources.length > 0) {
        lessonResources.classList.remove('d-none');
        resourcesList.innerHTML = '';
        
        lesson.resources.forEach(resource => {
          const resourceItem = document.createElement('a');
          resourceItem.href = resource.url;
          resourceItem.className = 'list-group-item list-group-item-action d-flex align-items-center';
          resourceItem.target = '_blank';
          
          resourceItem.innerHTML = `
            <i class="fa-solid fa-file-arrow-down text-primary me-2"></i>
            ${resource.name}
          `;
          
          resourcesList.appendChild(resourceItem);
        });
      } else {
        lessonResources.classList.add('d-none');
      }
    }
    
    // Load video
    loadVideo(lesson);
    
    // Hide quiz container
    if (quizContainer) {
      quizContainer.classList.add('d-none');
    }
    
    // Update navigation events
    if (prevLessonBtn) {
      prevLessonBtn.onclick = function() {
        if (currentLessonIndex > 0) {
          loadLesson(currentLessonIndex - 1);
        }
      };
    }
    
    if (nextLessonBtn) {
      nextLessonBtn.onclick = function() {
        if (currentLessonIndex < course.lessons.length - 1) {
          loadLesson(currentLessonIndex + 1);
        }
      };
    }
    
    if (markCompleteBtn) {
      markCompleteBtn.onclick = function() {
        if (isUserEnrolled) {
          studyStreamData.markLessonComplete(courseId, lesson.id);
          
          // Update UI
          markCompleteBtn.textContent = 'Completed';
          markCompleteBtn.disabled = true;
          markCompleteBtn.classList.replace('btn-primary', 'btn-success');
          
          // Update lesson list UI
          const lessonItems = document.querySelectorAll(`[data-lesson-index="${currentLessonIndex}"]`);
          lessonItems.forEach(item => {
            const statusIcon = item.querySelector('div:last-child');
            if (statusIcon) {
              statusIcon.innerHTML = '<i class="fa-solid fa-circle-check text-success"></i>';
            }
          });
          
          // Update progress indicator
          const progress = studyStreamData.calculateCourseProgress(courseId);
          if (progressCircle) {
            progressCircle.style.setProperty('--progress', `${progress}%`);
          }
          if (progressPercentage) progressPercentage.textContent = `${progress}%`;
        }
      };
    }
    
    // Update last accessed lesson
    if (user) {
      studyStreamData.updateLastAccessedLesson(courseId, lesson.id);
    }
    
    // Highlight current lesson in the list
    const lessonItems = document.querySelectorAll('#lesson-list .list-group-item-action');
    lessonItems.forEach((item, i) => {
      if (i === currentLessonIndex) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
    
    // Highlight in curriculum
    const curriculumItems = document.querySelectorAll('#curriculum-accordion .list-group-item-action');
    curriculumItems.forEach(item => {
      const itemIndex = parseInt(item.getAttribute('data-lesson-index'));
      if (itemIndex === currentLessonIndex) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
    
    // Scroll to top of lesson content
    window.scrollTo({
      top: document.getElementById('lesson-content').offsetTop - 80,
      behavior: 'smooth'
    });
  }
  
  function loadVideo(lesson) {
    if (!videoContainer) return;
    
    // Clear previous video
    videoContainer.innerHTML = '';
    
    if (lesson.videoUrl) {
      // Check if it's a YouTube video
      if (lesson.videoUrl.includes('youtube.com') || lesson.videoUrl.includes('youtu.be')) {
        // Create YouTube embed
        const iframe = document.createElement('iframe');
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.src = lesson.videoUrl;
        iframe.title = lesson.title;
        iframe.frameBorder = '0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        
        videoContainer.appendChild(iframe);
      } else {
        // Create custom video player
        const videoEl = document.createElement('div');
        videoEl.id = 'custom-video-player';
        videoEl.className = 'custom-video-player';
        
        videoContainer.appendChild(videoEl);
        
        // Initialize video player
        videoPlayer = new CustomVideoPlayer(videoEl.id, {
          src: lesson.videoUrl,
          title: lesson.title
        });
      }
    } else {
      // No video available
      videoContainer.innerHTML = `
        <div class="d-flex justify-content-center align-items-center bg-light h-100 p-4 text-center">
          <div>
            <i class="fa-solid fa-video-slash fa-3x mb-3 text-muted"></i>
            <p class="mb-0">No video available for this lesson.</p>
          </div>
        </div>
      `;
    }
  }
  
  function showQuiz(quiz) {
    if (!quizContainer || !videoContainer) return;
    
    videoContainer.classList.add('d-none');
    quizContainer.classList.remove('d-none');
    
    // Initialize quiz component
    const quizComponent = new QuizComponent(quiz, quizContainer, handleQuizComplete);
    quizComponent.render();
  }
  
  function handleQuizComplete(score) {
    const lesson = course.lessons[currentLessonIndex];
    
    // Save quiz score
    if (user) {
      studyStreamData.saveQuizScore(courseId, lesson.quiz.id, score);
      
      // Mark lesson as complete when quiz is finished
      studyStreamData.markLessonComplete(courseId, lesson.id);
    }
    
    // Show results modal
    const quizResultModal = new bootstrap.Modal(document.getElementById('quizResultModal'));
    
    // Update modal content
    document.getElementById('result-percentage').textContent = `${score}%`;
    document.getElementById('correct-answers').textContent = Math.round((score / 100) * lesson.quiz.questions.length);
    document.getElementById('total-questions').textContent = lesson.quiz.questions.length;
    
    if (score >= 70) {
      document.getElementById('result-message').textContent = "Great job! You've passed the quiz.";
    } else {
      document.getElementById('result-message').textContent = "Keep studying and try again later.";
    }
    
    // Continue button handler
    document.getElementById('continue-after-quiz').onclick = function() {
      quizResultModal.hide();
      
      // Hide quiz container and show video
      quizContainer.classList.add('d-none');
      videoContainer.classList.remove('d-none');
      
      // If it's the last lesson, show completed
      if (markCompleteBtn) {
        markCompleteBtn.textContent = 'Completed';
        markCompleteBtn.disabled = true;
        markCompleteBtn.classList.replace('btn-primary', 'btn-success');
      }
      
      // Update lesson list UI
      const lessonItems = document.querySelectorAll(`[data-lesson-index="${currentLessonIndex}"]`);
      lessonItems.forEach(item => {
        const statusIcon = item.querySelector('div:last-child');
        if (statusIcon) {
          statusIcon.innerHTML = '<i class="fa-solid fa-circle-check text-success"></i>';
        }
      });
      
      // Update progress indicator
      const progress = studyStreamData.calculateCourseProgress(courseId);
      if (progressCircle) {
        progressCircle.style.setProperty('--progress', `${progress}%`);
      }
      if (progressPercentage) progressPercentage.textContent = `${progress}%`;
      
      // Move to next lesson if available
      if (currentLessonIndex < course.lessons.length - 1) {
        loadLesson(currentLessonIndex + 1);
      }
    };
    
    quizResultModal.show();
  }
});
