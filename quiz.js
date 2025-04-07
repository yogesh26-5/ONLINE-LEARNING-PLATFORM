/**
 * StudyStream Quiz Component
 * Handles rendering and interaction with course quizzes
 */

class QuizComponent {
  constructor(quiz, container, onComplete) {
    this.quiz = quiz;
    this.container = container;
    this.onComplete = onComplete;
    this.currentQuestionIndex = 0;
    this.selectedOptions = Array(quiz.questions.length).fill(-1);
    this.isSubmitted = false;
    this.isCompleted = false;
  }
  
  render() {
    this.container.innerHTML = '';
    
    if (this.isCompleted) {
      this.renderResults();
    } else {
      this.renderQuestion();
    }
  }
  
  renderQuestion() {
    const currentQuestion = this.quiz.questions[this.currentQuestionIndex];
    const isLastQuestion = this.currentQuestionIndex === this.quiz.questions.length - 1;
    const hasSelectedOption = this.selectedOptions[this.currentQuestionIndex] !== -1;
    
    const quizCard = document.createElement('div');
    quizCard.className = 'card';
    
    quizCard.innerHTML = `
      <div class="card-header">
        <h5 class="card-title mb-0">${this.quiz.title}</h5>
        <div class="text-muted mt-1 small">
          Question ${this.currentQuestionIndex + 1} of ${this.quiz.questions.length}
        </div>
      </div>
      <div class="card-body">
        <div class="mb-4">
          <h5 class="fw-medium mb-3">${currentQuestion.text}</h5>
          <div class="options-container mb-3">
            ${this.renderOptions(currentQuestion)}
          </div>
          
          <div class="progress" style="height: 4px;">
            <div class="progress-bar bg-primary" 
                 style="width: ${((this.currentQuestionIndex + 1) / this.quiz.questions.length) * 100}%">
            </div>
          </div>
        </div>
      </div>
      <div class="card-footer">
        <button class="btn btn-primary w-100 next-btn" ${!hasSelectedOption || this.isSubmitted ? 'disabled' : ''}>
          ${this.isSubmitted ? 'Processing...' : isLastQuestion ? 'Submit Quiz' : 'Next Question'}
        </button>
      </div>
    `;
    
    this.container.appendChild(quizCard);
    
    // Add event listener to next button
    const nextBtn = this.container.querySelector('.next-btn');
    nextBtn.addEventListener('click', () => this.handleNext());
    
    // Add event listeners to options
    const optionElements = this.container.querySelectorAll('.quiz-option');
    optionElements.forEach((element, index) => {
      element.addEventListener('click', () => {
        if (this.isSubmitted) return;
        this.handleOptionSelect(index);
      });
    });
  }
  
  renderOptions(question) {
    return question.options.map((option, index) => {
      const isSelected = this.selectedOptions[this.currentQuestionIndex] === index;
      const isSubmitted = this.isSubmitted;
      const isCorrect = index === question.correctOptionIndex;
      
      let optionClass = 'quiz-option border rounded p-3 mb-2 cursor-pointer transition';
      
      if (isSelected) {
        optionClass += ' selected';
        
        if (isSubmitted) {
          optionClass += isCorrect ? ' correct' : ' incorrect';
        }
      }
      
      if (isSubmitted && !isSelected && isCorrect) {
        optionClass += ' correct';
      }
      
      let statusIcon = '';
      
      if (isSubmitted) {
        if (isSelected && isCorrect) {
          statusIcon = '<i class="fa-solid fa-check text-success float-end"></i>';
        } else if (isSelected && !isCorrect) {
          statusIcon = '<i class="fa-solid fa-xmark text-danger float-end"></i>';
        } else if (!isSelected && isCorrect) {
          statusIcon = '<i class="fa-solid fa-check text-success float-end"></i>';
        }
      }
      
      return `
        <div class="${optionClass}" data-option-index="${index}">
          <div class="d-flex align-items-center">
            <div class="me-3">
              <div class="option-indicator ${isSelected ? 'selected' : ''}">
                ${String.fromCharCode(65 + index)}
              </div>
            </div>
            <div class="flex-grow-1">${option}</div>
            ${statusIcon}
          </div>
        </div>
      `;
    }).join('');
  }
  
  handleOptionSelect(optionIndex) {
    this.selectedOptions[this.currentQuestionIndex] = optionIndex;
    
    // Update UI to show selected option
    const options = this.container.querySelectorAll('.quiz-option');
    options.forEach((option, index) => {
      option.classList.toggle('selected', index === optionIndex);
    });
    
    // Enable next button
    const nextBtn = this.container.querySelector('.next-btn');
    if (nextBtn) nextBtn.disabled = false;
  }
  
  handleNext() {
    if (!this.hasSelectedOption() || this.isSubmitted) {
      return;
    }
    
    this.isSubmitted = true;
    
    // Update button state
    const nextBtn = this.container.querySelector('.next-btn');
    if (nextBtn) {
      nextBtn.disabled = true;
      nextBtn.textContent = 'Processing...';
    }
    
    // Show correct and incorrect answers
    this.showAnswerResult();
    
    // Proceed to next question or complete quiz after delay
    setTimeout(() => {
      this.isSubmitted = false;
      
      if (this.currentQuestionIndex === this.quiz.questions.length - 1) {
        // Last question, complete the quiz
        this.completeQuiz();
      } else {
        // Move to next question
        this.currentQuestionIndex++;
        this.render();
      }
    }, 1500);
  }
  
  showAnswerResult() {
    const currentQuestion = this.quiz.questions[this.currentQuestionIndex];
    const selectedOptionIndex = this.selectedOptions[this.currentQuestionIndex];
    const correctOptionIndex = currentQuestion.correctOptionIndex;
    
    const options = this.container.querySelectorAll('.quiz-option');
    
    options.forEach((option, index) => {
      const isSelected = index === selectedOptionIndex;
      const isCorrect = index === correctOptionIndex;
      
      if (isSelected) {
        option.classList.add(isCorrect ? 'correct' : 'incorrect');
        
        // Add icon
        const iconElement = document.createElement('i');
        iconElement.className = isCorrect 
          ? 'fa-solid fa-check text-success float-end' 
          : 'fa-solid fa-xmark text-danger float-end';
        
        option.querySelector('div.flex-grow-1').appendChild(iconElement);
      } else if (isCorrect) {
        option.classList.add('correct');
        
        // Add icon
        const iconElement = document.createElement('i');
        iconElement.className = 'fa-solid fa-check text-success float-end';
        option.querySelector('div.flex-grow-1').appendChild(iconElement);
      }
    });
  }
  
  completeQuiz() {
    this.isCompleted = true;
    
    // Calculate score
    const score = this.calculateScore();
    
    // Call onComplete callback
    if (typeof this.onComplete === 'function') {
      this.onComplete(score);
    }
  }
  
  calculateScore() {
    const correctAnswers = this.quiz.questions.reduce((count, question, index) => {
      return this.selectedOptions[index] === question.correctOptionIndex ? count + 1 : count;
    }, 0);
    
    return Math.round((correctAnswers / this.quiz.questions.length) * 100);
  }
  
  renderResults() {
    const score = this.calculateScore();
    const correctAnswers = this.quiz.questions.filter((q, i) => 
      this.selectedOptions[i] === q.correctOptionIndex
    ).length;
    
    const resultCard = document.createElement('div');
    resultCard.className = 'card';
    
    resultCard.innerHTML = `
      <div class="card-header text-center">
        <h5 class="card-title">${this.quiz.title} - Results</h5>
        <div class="text-muted mt-1">
          You scored ${correctAnswers} out of ${this.quiz.questions.length} questions correctly.
        </div>
      </div>
      <div class="card-body">
        <div class="d-flex flex-column align-items-center py-4">
          <div class="result-circle mb-3">
            <span class="display-4 fw-bold">${score}%</span>
          </div>
          <p class="text-muted">
            ${score >= 70 ? 'Great job!' : 'Keep studying!'}
          </p>
        </div>
        
        <h6 class="fw-bold mb-3">Question Summary</h6>
        <div class="questions-summary">
          ${this.renderQuestionSummary()}
        </div>
      </div>
      <div class="card-footer">
        <button class="btn btn-outline-primary w-100 back-to-lesson-btn">
          Back to Lesson
        </button>
      </div>
    `;
    
    this.container.appendChild(resultCard);
    
    // Add event listener to back button
    const backBtn = this.container.querySelector('.back-to-lesson-btn');
    backBtn.addEventListener('click', () => {
      // Hide quiz and show video
      this.container.classList.add('d-none');
      document.getElementById('video-container').classList.remove('d-none');
      
      // Reset quiz state for potential future attempts
      this.currentQuestionIndex = 0;
      this.selectedOptions = Array(this.quiz.questions.length).fill(-1);
      this.isSubmitted = false;
      this.isCompleted = false;
    });
  }
  
  renderQuestionSummary() {
    return this.quiz.questions.map((question, index) => {
      const isCorrect = this.selectedOptions[index] === question.correctOptionIndex;
      
      return `
        <div class="card mb-3">
          <div class="card-body">
            <div class="d-flex justify-content-between mb-2">
              <span class="fw-medium">Question ${index + 1}</span>
              <span class="badge ${isCorrect ? 'bg-success' : 'bg-danger'}">
                ${isCorrect ? 'Correct' : 'Incorrect'}
              </span>
            </div>
            <p class="mb-2">${question.text}</p>
            <div class="ms-2 small">
              <p class="mb-1">Your answer: ${question.options[this.selectedOptions[index]]}</p>
              ${!isCorrect ? `
                <p class="mb-0 text-success">Correct answer: ${question.options[question.correctOptionIndex]}</p>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
  
  hasSelectedOption() {
    return this.selectedOptions[this.currentQuestionIndex] !== -1;
  }
}
