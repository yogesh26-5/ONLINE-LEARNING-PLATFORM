/**
 * StudyStream Profile Page
 * Handles user profile, enrolled courses, and settings
 */

document.addEventListener('DOMContentLoaded', function() {
  // Get user information
  const user = studyStreamData.getCurrentUser();
  
  // Redirect to login if not authenticated
  if (!user) {
    window.location.href = 'auth.html?type=login';
    return;
  }
  
  // Initialize the page
  init();
  
  function init() {
    // Load user information
    loadUserProfile();
    
    // Load enrolled courses
    loadEnrolledCourses();
    
    // Load recent activities
    loadRecentActivities();
    
    // Set up profile form
    setupProfileForm();
    
    // Set up preferences form
    setupPreferencesForm();
    
    // Set up danger zone
    setupDangerZone();
  }
  
  function loadUserProfile() {
    // Update profile information
    const profileName = document.getElementById('profile-name');
    const profileEmail = document.getElementById('profile-email');
    const profileAvatar = document.getElementById('profile-avatar');
    const enrolledCount = document.getElementById('enrolled-count');
    const completedCount = document.getElementById('completed-count');
    const hoursSpent = document.getElementById('hours-spent');
    
    if (profileName) profileName.textContent = user.name;
    if (profileEmail) profileEmail.textContent = user.email;
    if (profileAvatar) profileAvatar.src = user.avatar;
    
    // Get enrolled courses
    const enrolledCourses = studyStreamData.getEnrolledCourses();
    
    if (enrolledCount) enrolledCount.textContent = enrolledCourses.length;
    
    // Calculate completed courses
    if (completedCount) {
      const completedCoursesCount = enrolledCourses.filter(course => {
        const progress = studyStreamData.calculateCourseProgress(course.id);
        return progress === 100;
      }).length;
      
      completedCount.textContent = completedCoursesCount;
    }
    
    // Calculate approximate hours spent (based on completed lessons)
    if (hoursSpent) {
      let totalMinutes = 0;
      
      enrolledCourses.forEach(course => {
        const progress = studyStreamData.getUserProgress();
        if (progress && progress.completedLessons[course.id]) {
          const completedLessonIds = progress.completedLessons[course.id];
          
          completedLessonIds.forEach(lessonId => {
            const lesson = course.lessons.find(l => l.id === lessonId);
            if (lesson) {
              const [minutes, seconds] = lesson.duration.split(':').map(Number);
              totalMinutes += minutes + (seconds / 60);
            }
          });
        }
      });
      
      const hours = Math.floor(totalMinutes / 60);
      hoursSpent.textContent = hours;
    }
  }
  
  function loadEnrolledCourses() {
    const enrolledCourses = studyStreamData.getEnrolledCourses();
    
    // In progress courses in the overview tab
    const inProgressCoursesContainer = document.getElementById('in-progress-courses');
    const noProgressCoursesMsg = document.getElementById('no-progress-courses');
    
    if (inProgressCoursesContainer) {
      if (enrolledCourses.length === 0) {
        // No enrolled courses
        if (noProgressCoursesMsg) noProgressCoursesMsg.classList.remove('d-none');
      } else {
        // Has enrolled courses
        if (noProgressCoursesMsg) noProgressCoursesMsg.classList.add('d-none');
        
        // Filter courses in progress (not 100% complete)
        const inProgressCourses = enrolledCourses.filter(course => {
          const progress = studyStreamData.calculateCourseProgress(course.id);
          return progress > 0 && progress < 100;
        }).slice(0, 3); // Show only up to 3
        
        if (inProgressCourses.length > 0) {
          inProgressCourses.forEach(course => {
            const progress = studyStreamData.calculateCourseProgress(course.id);
            
            const courseItem = document.createElement('a');
            courseItem.href = `course-detail.html?id=${course.id}`;
            courseItem.className = 'list-group-item list-group-item-action p-3';
            
            courseItem.innerHTML = `
              <div class="d-flex align-items-center">
                <img src="${course.thumbnail}" class="rounded me-3" width="60" height="45" style="object-fit: cover;">
                <div class="flex-grow-1">
                  <h6 class="mb-1">${course.title}</h6>
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="text-muted small">${progress}% complete</div>
                    <div class="text-primary small">Continue</div>
                  </div>
                  <div class="progress mt-1" style="height: 5px;">
                    <div class="progress-bar bg-primary" style="width: ${progress}%"></div>
                  </div>
                </div>
              </div>
            `;
            
            inProgressCoursesContainer.appendChild(courseItem);
          });
        } else {
          // No courses in progress
          const noInProgressMsg = document.createElement('div');
          noInProgressMsg.className = 'list-group-item p-4 text-center';
          noInProgressMsg.innerHTML = `
            <p class="mb-2 text-muted">You haven't started any of your enrolled courses yet.</p>
            <a href="courses.html" class="btn btn-primary btn-sm">Browse Courses</a>
          `;
          
          inProgressCoursesContainer.appendChild(noInProgressMsg);
        }
      }
    }
    
    // All enrolled courses in the courses tab
    const allCoursesContainer = document.getElementById('all-courses-container');
    const inProgressContainer = document.getElementById('in-progress-container');
    const completedContainer = document.getElementById('completed-container');
    const noAllCourses = document.getElementById('no-all-courses');
    const noInProgress = document.getElementById('no-in-progress');
    const noCompleted = document.getElementById('no-completed');
    
    if (allCoursesContainer && inProgressContainer && completedContainer) {
      if (enrolledCourses.length === 0) {
        // No enrolled courses
        if (noAllCourses) noAllCourses.classList.remove('d-none');
        if (noInProgress) noInProgress.classList.remove('d-none');
        if (noCompleted) noCompleted.classList.remove('d-none');
      } else {
        // Has enrolled courses
        if (noAllCourses) noAllCourses.classList.add('d-none');
        
        // Filter courses by progress
        const inProgressCourses = [];
        const completedCourses = [];
        
        enrolledCourses.forEach(course => {
          const progress = studyStreamData.calculateCourseProgress(course.id);
          
          // All courses tab
          const courseCard = createCourseCard(course, progress);
          allCoursesContainer.appendChild(courseCard);
          
          // Sort into in-progress and completed
          if (progress === 100) {
            completedCourses.push(course);
            const completedCard = createCourseCard(course, progress);
            completedContainer.appendChild(completedCard);
          } else {
            inProgressCourses.push(course);
            const inProgressCard = createCourseCard(course, progress);
            inProgressContainer.appendChild(inProgressCard);
          }
        });
        
        // Show/hide empty messages
        if (inProgressCourses.length === 0 && noInProgress) {
          noInProgress.classList.remove('d-none');
        } else if (noInProgress) {
          noInProgress.classList.add('d-none');
        }
        
        if (completedCourses.length === 0 && noCompleted) {
          noCompleted.classList.remove('d-none');
        } else if (noCompleted) {
          noCompleted.classList.add('d-none');
        }
      }
    }
  }
  
  function createCourseCard(course, progress) {
    const courseCol = document.createElement('div');
    courseCol.className = 'col-md-6';
    
    courseCol.innerHTML = `
      <a href="course-detail.html?id=${course.id}" class="card shadow-sm h-100 course-card text-decoration-none">
        <div class="course-thumbnail">
          <img src="${course.thumbnail}" alt="${course.title}">
          <div class="course-progress-overlay">
            <div class="d-flex justify-content-between text-white small mb-1">
              <span>Progress</span>
              <span>${progress}%</span>
            </div>
            <div class="progress" style="height: 4px;">
              <div class="progress-bar ${progress === 100 ? 'bg-success' : 'bg-primary'}" style="width: ${progress}%"></div>
            </div>
          </div>
        </div>
        <div class="card-body p-3">
          <h5 class="card-title mb-1">${course.title}</h5>
          <p class="text-muted small mb-2">${course.instructor}</p>
          <div class="d-flex align-items-center">
            <span class="badge ${progress === 100 ? 'bg-success' : 'bg-primary'} me-2">
              ${progress === 100 ? 'Completed' : 'In Progress'}
            </span>
            <span class="text-muted small">
              ${course.lessons.length} ${course.lessons.length === 1 ? 'lesson' : 'lessons'}
            </span>
          </div>
        </div>
      </a>
    `;
    
    return courseCol;
  }
  
  function loadRecentActivities() {
    const recentActivityContainer = document.getElementById('recent-activity');
    const noActivitiesMsg = document.getElementById('no-activities');
    
    if (!recentActivityContainer) return;
    
    // In a real app, we'd track user activities in a database
    // For this demo, we'll generate some sample activities based on user progress
    
    // Get enrolled courses and user progress
    const enrolledCourses = studyStreamData.getEnrolledCourses();
    const progress = studyStreamData.getUserProgress();
    
    if (!progress || !enrolledCourses.length) {
      // No activities to show
      if (noActivitiesMsg) noActivitiesMsg.classList.remove('d-none');
      return;
    }
    
    // Check if there's any activity data
    let hasActivities = false;
    
    enrolledCourses.forEach(course => {
      const courseProgress = progress.completedLessons[course.id];
      if (courseProgress && courseProgress.length) {
        hasActivities = true;
        
        // Create activity item for the most recent completed lesson
        const mostRecentLessonId = courseProgress[courseProgress.length - 1];
        const lesson = course.lessons.find(l => l.id === mostRecentLessonId);
        
        if (lesson) {
          const activityItem = document.createElement('div');
          activityItem.className = 'list-group-item p-3';
          
          activityItem.innerHTML = `
            <div class="d-flex">
              <div class="activity-icon bg-light rounded-circle p-2 me-3">
                <i class="fa-solid fa-check text-success"></i>
              </div>
              <div>
                <p class="mb-1">Completed lesson: <strong>${lesson.title}</strong> in <a href="course-detail.html?id=${course.id}" class="fw-bold">${course.title}</a></p>
                <p class="text-muted small mb-0">Just now</p>
              </div>
            </div>
          `;
          
          recentActivityContainer.appendChild(activityItem);
        }
      }
      
      // Check for quiz completions
      const quizScores = progress.quizScores[course.id];
      if (quizScores) {
        Object.keys(quizScores).forEach(quizId => {
          hasActivities = true;
          
          // Find the lesson with this quiz
          const lessonWithQuiz = course.lessons.find(l => l.hasQuiz && l.quiz.id === quizId);
          if (lessonWithQuiz) {
            const activityItem = document.createElement('div');
            activityItem.className = 'list-group-item p-3';
            
            activityItem.innerHTML = `
              <div class="d-flex">
                <div class="activity-icon bg-light rounded-circle p-2 me-3">
                  <i class="fa-solid fa-question-circle text-primary"></i>
                </div>
                <div>
                  <p class="mb-1">Completed quiz in <strong>${lessonWithQuiz.title}</strong> with score: <span class="badge bg-${quizScores[quizId] >= 70 ? 'success' : 'warning'}">${quizScores[quizId]}%</span></p>
                  <p class="text-muted small mb-0">Recently</p>
                </div>
              </div>
            `;
            
            recentActivityContainer.appendChild(activityItem);
          }
        });
      }
    });
    
    // If enrolled but no activities yet
    if (!hasActivities && noActivitiesMsg) {
      noActivitiesMsg.classList.remove('d-none');
    } else if (noActivitiesMsg) {
      noActivitiesMsg.classList.add('d-none');
    }
  }
  
  function setupProfileForm() {
    const profileForm = document.getElementById('profile-form');
    const settingsName = document.getElementById('settings-name');
    const settingsEmail = document.getElementById('settings-email');
    const settingsBio = document.getElementById('settings-bio');
    const settingsAvatar = document.getElementById('settings-avatar');
    
    if (profileForm && settingsName && settingsEmail) {
      // Fill form with user data
      settingsName.value = user.name;
      settingsEmail.value = user.email;
      if (settingsBio) settingsBio.value = user.bio || '';
      if (settingsAvatar) settingsAvatar.src = user.avatar;
      
      // Handle form submission
      profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const saveBtn = document.getElementById('save-profile-btn');
        const saveSpinner = document.getElementById('save-profile-spinner');
        
        // Show loading state
        saveBtn.disabled = true;
        if (saveSpinner) saveSpinner.classList.remove('d-none');
        
        // Prepare updated data
        const updatedData = {
          name: settingsName.value,
          bio: settingsBio ? settingsBio.value : undefined
        };
        
        // Update user profile
        studyStreamAuth.updateProfile(updatedData)
          .then(response => {
            alert('Profile updated successfully!');
            
            // Update profile name display
            const profileNameEls = document.querySelectorAll('#profile-name');
            profileNameEls.forEach(el => {
              el.textContent = response.user.name;
            });
            
            // Reset form state
            saveBtn.disabled = false;
            if (saveSpinner) saveSpinner.classList.add('d-none');
          })
          .catch(error => {
            alert('Failed to update profile: ' + error.message);
            saveBtn.disabled = false;
            if (saveSpinner) saveSpinner.classList.add('d-none');
          });
      });
    }
  }
  
  function setupPreferencesForm() {
    const preferencesForm = document.getElementById('preferences-form');
    
    if (preferencesForm) {
      preferencesForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // In a real app, we would save these preferences to user data
        alert('Preferences saved successfully!');
      });
    }
  }
  
  function setupDangerZone() {
    const deleteAccountBtn = document.getElementById('delete-account-btn');
    
    if (deleteAccountBtn) {
      deleteAccountBtn.addEventListener('click', function() {
        const confirmed = confirm('Are you sure you want to delete your account? This action cannot be undone.');
        
        if (confirmed) {
          // In a real app, we would send a request to delete the account
          // For this demo, we'll just log out
          alert('Account deleted. You will now be logged out.');
          studyStreamAuth.logout();
          window.location.href = 'index.html';
        }
      });
    }
  }
});
