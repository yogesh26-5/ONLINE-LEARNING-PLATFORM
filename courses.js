/**
 * StudyStream Courses Page
 * Handles course listing and filtering
 */

document.addEventListener('DOMContentLoaded', function() {
  // Get all courses
  const courses = studyStreamData.getAllCourses();
  const categories = studyStreamData.getCategories();
  
  // DOM elements
  const coursesContainer = document.getElementById('courses-container');
  const courseSearch = document.getElementById('course-search');
  const clearSearch = document.getElementById('clear-search');
  const courseCount = document.getElementById('course-count');
  const coursePlural = document.getElementById('course-plural');
  const noCoursesFound = document.getElementById('no-courses-found');
  const categoryFilters = document.getElementById('category-filters');
  const clearFiltersBtn = document.getElementById('clear-filters');
  const activeFilters = document.getElementById('active-filters');
  const filterBadges = document.getElementById('filter-badges');
  
  // State
  let filteredCourses = [...courses];
  let selectedCategory = 'all';
  let searchQuery = '';
  
  // Initialize the page
  init();
  
  function init() {
    // Check URL params for initial filter
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    
    if (categoryParam) {
      selectedCategory = categoryParam;
    }
    
    // Create category filter buttons
    categories.forEach(category => {
      const filterBtn = document.createElement('button');
      filterBtn.className = `btn btn-sm btn-outline-primary category-filter me-2`;
      filterBtn.setAttribute('data-category', category);
      filterBtn.textContent = category;
      
      filterBtn.addEventListener('click', function() {
        setSelectedCategory(category);
      });
      
      categoryFilters.appendChild(filterBtn);
    });
    
    // Set initial filter from URL if present
    if (categoryParam && categories.includes(categoryParam)) {
      setSelectedCategory(categoryParam);
    }
    
    // Render initial courses
    updateCourseDisplay();
    
    // Set up event listeners
    setupEventListeners();
  }
  
  function setupEventListeners() {
    // Search input
    if (courseSearch) {
      courseSearch.addEventListener('input', function() {
        searchQuery = this.value.trim().toLowerCase();
        
        if (searchQuery === '') {
          clearSearch.classList.add('d-none');
        } else {
          clearSearch.classList.remove('d-none');
        }
        
        updateCourseDisplay();
      });
    }
    
    // Clear search button
    if (clearSearch) {
      clearSearch.addEventListener('click', function() {
        courseSearch.value = '';
        searchQuery = '';
        clearSearch.classList.add('d-none');
        updateCourseDisplay();
      });
    }
    
    // All categories button
    document.querySelector('[data-category="all"]').addEventListener('click', function() {
      setSelectedCategory('all');
    });
    
    // Clear filters button
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', function() {
        setSelectedCategory('all');
        courseSearch.value = '';
        searchQuery = '';
        clearSearch.classList.add('d-none');
        updateCourseDisplay();
      });
    }
  }
  
  function setSelectedCategory(category) {
    selectedCategory = category;
    
    // Update active button
    document.querySelectorAll('.category-filter').forEach(btn => {
      if (btn.getAttribute('data-category') === category) {
        btn.classList.remove('btn-outline-primary');
        btn.classList.add('btn-primary');
      } else {
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-outline-primary');
      }
    });
    
    // Update active filters display
    if (category !== 'all') {
      activeFilters.classList.remove('d-none');
      filterBadges.innerHTML = `
        <span class="badge bg-secondary d-inline-flex align-items-center me-2">
          ${category}
          <button type="button" class="btn-close btn-close-white ms-2" style="font-size: 0.65em;" aria-label="Remove"></button>
        </span>
      `;
      
      // Add event listener to the badge close button
      const closeBtn = filterBadges.querySelector('.btn-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', function() {
          setSelectedCategory('all');
        });
      }
    } else {
      activeFilters.classList.add('d-none');
    }
    
    updateCourseDisplay();
  }
  
  function updateCourseDisplay() {
    // Filter courses based on search query and selected category
    filteredCourses = courses.filter(course => {
      const matchesSearch = !searchQuery || 
        course.title.toLowerCase().includes(searchQuery) || 
        course.instructor.toLowerCase().includes(searchQuery) ||
        course.category.toLowerCase().includes(searchQuery);
      
      const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
    
    // Update course count
    if (courseCount) {
      courseCount.textContent = filteredCourses.length;
    }
    
    if (coursePlural) {
      coursePlural.textContent = filteredCourses.length === 1 ? '' : 's';
    }
    
    // Clear container
    coursesContainer.innerHTML = '';
    
    // Show/hide "no courses found" message
    if (filteredCourses.length === 0) {
      noCoursesFound.classList.remove('d-none');
    } else {
      noCoursesFound.classList.add('d-none');
      
      // Render courses
      displayCourses(filteredCourses, coursesContainer);
    }
  }
  
  function displayCourses(courses, container) {
    const user = studyStreamData.getCurrentUser();
    
    courses.forEach(course => {
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
});
