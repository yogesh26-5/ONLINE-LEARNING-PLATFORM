/**
 * StudyStream Main JavaScript
 * Handles home page functionality
 */

document.addEventListener('DOMContentLoaded', function() {
  // Display popular courses on home page
  const popularCoursesContainer = document.getElementById('popular-courses');
  if (popularCoursesContainer) {
    const popularCourses = studyStreamData.getPopularCourses().slice(0, 6);
    displayCourses(popularCourses, popularCoursesContainer);
  }
  
  // Set up search functionality
  const heroSearch = document.getElementById('hero-search');
  const searchResults = document.getElementById('search-results');
  
  if (heroSearch && searchResults) {
    heroSearch.addEventListener('focus', function() {
      if (heroSearch.value.trim() !== '') {
        searchResults.classList.remove('d-none');
      }
    });
    
    heroSearch.addEventListener('blur', function(e) {
      // Delay hiding to allow clicking on results
      setTimeout(() => {
        searchResults.classList.add('d-none');
      }, 200);
    });
    
    heroSearch.addEventListener('input', function() {
      const query = heroSearch.value.trim();
      
      if (query === '') {
        searchResults.classList.add('d-none');
        return;
      }
      
      const results = studyStreamData.searchCourses(query);
      
      searchResults.innerHTML = '';
      
      if (results.length > 0) {
        results.forEach(course => {
          const resultItem = document.createElement('a');
          resultItem.href = `course-detail.html?id=${course.id}`;
          resultItem.className = 'list-group-item list-group-item-action py-3';
          
          resultItem.innerHTML = `
            <div class="d-flex align-items-center">
              <img src="${course.thumbnail}" alt="${course.title}" class="rounded me-3" width="50" height="35" style="object-fit: cover;">
              <div>
                <h6 class="mb-0">${course.title}</h6>
                <p class="mb-0 text-muted small">${course.instructor} • ${course.category}</p>
              </div>
            </div>
          `;
          
          searchResults.appendChild(resultItem);
        });
        
        searchResults.classList.remove('d-none');
      } else {
        const noResults = document.createElement('div');
        noResults.className = 'p-3 text-center text-muted';
        noResults.textContent = `No courses found for "${query}"`;
        searchResults.appendChild(noResults);
        searchResults.classList.remove('d-none');
      }
    });
  }
  
  // Display categories
  const categoriesContainer = document.getElementById('categories-container');
  if (categoriesContainer) {
    const categories = studyStreamData.getCategories();
    categories.forEach(category => {
      const categoryCol = document.createElement('div');
      categoryCol.className = 'col-md-4 col-lg-3';
      
      categoryCol.innerHTML = `
        <a href="courses.html?category=${encodeURIComponent(category)}" class="card shadow-sm h-100 text-decoration-none">
          <div class="card-body text-center py-4">
            <h5 class="mb-0">${category}</h5>
          </div>
        </a>
      `;
      
      categoriesContainer.appendChild(categoryCol);
    });
  }
});

// Function to display courses in a grid
function displayCourses(courses, container) {
  courses.forEach(course => {
    const user = studyStreamData.getCurrentUser();
    const progress = user ? studyStreamData.calculateCourseProgress(course.id) : 0;
    
    const courseCol = document.createElement('div');
    courseCol.className = 'col-md-6 col-lg-4';
    
    courseCol.innerHTML = `
      <a href="course-detail.html?id=${course.id}" class="card shadow-sm h-100 course-card text-decoration-none">
        <div class="course-thumbnail">
          <img src="${course.thumbnail}" alt="${course.title}">
          ${progress > 0 ? `
            <div class="course-progress-overlay">
              <div class="d-flex justify-content-between text-white small mb-1">
                <span>Progress</span>
                <span>${progress}%</span>
              </div>
              <div class="progress" style="height: 4px;">
                <div class="progress-bar bg-primary" style="width: ${progress}%"></div>
              </div>
            </div>
          ` : ''}
        </div>
        <div class="card-body p-3">
          <h5 class="card-title mb-1">${course.title}</h5>
          <p class="text-muted small mb-2">${course.instructor}</p>
          <div class="d-flex align-items-center text-muted small gap-3">
            <div class="d-flex align-items-center">
              <i class="fa-solid fa-star text-warning me-1"></i>
              <span>${course.rating.toFixed(1)}</span>
            </div>
            <div class="d-flex align-items-center">
              <i class="fa-solid fa-users text-primary me-1"></i>
              <span>${course.enrolledCount.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div class="card-footer bg-light py-2 small">
          <span>${course.lessons.length} ${course.lessons.length === 1 ? 'lesson' : 'lessons'}</span>
        </div>
      </a>
    `;
    
    container.appendChild(courseCol);
  });
}
