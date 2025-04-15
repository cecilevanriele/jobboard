// JavaScript for the job board static export

// Global variables
let allJobs = [];
let categories = [];
let filteredJobs = [];

// DOM elements
const jobsContainer = document.getElementById('jobs-container');
const totalJobsElement = document.getElementById('total-jobs');
const newTodayElement = document.getElementById('new-today');
const categorySelect = document.getElementById('category');
const searchButton = document.getElementById('search-button');
const lastUpdatedElement = document.getElementById('last-updated');

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  // Load job data
  fetchJobs();
  
  // Set up event listeners
  searchButton.addEventListener('click', handleSearch);
});

// Fetch jobs from the data file
async function fetchJobs() {
  try {
    const response = await fetch('data/jobs.json');
    const data = await response.json();
    
    if (data && Array.isArray(data)) {
      allJobs = data;
      filteredJobs = [...allJobs];
      
      // Extract categories
      extractCategories();
      
      // Update stats
      updateStats();
      
      // Render jobs
      renderJobs(filteredJobs);
    } else {
      showError('Invalid data format');
    }
  } catch (error) {
    console.error('Error fetching jobs:', error);
    showError('Failed to load job data');
  }
}

// Extract unique categories from jobs
function extractCategories() {
  const categorySet = new Set();
  
  allJobs.forEach(job => {
    if (job.categories && Array.isArray(job.categories)) {
      job.categories.forEach(category => {
        categorySet.add(category);
      });
    }
  });
  
  categories = Array.from(categorySet).sort();
  
  // Populate category select
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
}

// Update statistics
function updateStats() {
  // Total jobs
  totalJobsElement.textContent = allJobs.length;
  
  // New today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const newToday = allJobs.filter(job => {
    if (!job.date_posted) return false;
    const jobDate = new Date(job.date_posted);
    return jobDate >= today;
  }).length;
  
  newTodayElement.textContent = newToday;
  
  // Last updated
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  lastUpdatedElement.textContent = lastUpdated;
}

// Handle search
function handleSearch() {
  const keyword = document.getElementById('keyword').value.toLowerCase();
  const location = document.getElementById('location').value.toLowerCase();
  const company = document.getElementById('company').value;
  const category = document.getElementById('category').value;
  const datePosted = document.getElementById('date-posted').value;
  
  filteredJobs = allJobs.filter(job => {
    // Keyword filter
    if (keyword && !(
      (job.title && job.title.toLowerCase().includes(keyword)) ||
      (job.description && job.description.toLowerCase().includes(keyword))
    )) {
      return false;
    }
    
    // Location filter
    if (location && !(
      job.location && job.location.toLowerCase().includes(location)
    )) {
      return false;
    }
    
    // Company filter
    if (company && job.company !== company) {
      return false;
    }
    
    // Category filter
    if (category && !(
      job.categories && job.categories.includes(category)
    )) {
      return false;
    }
    
    // Date posted filter
    if (datePosted) {
      if (!job.date_posted) return false;
      
      const jobDate = new Date(job.date_posted);
      const now = new Date();
      const daysAgo = Math.floor((now - jobDate) / (1000 * 60 * 60 * 24));
      
      if (daysAgo > parseInt(datePosted)) {
        return false;
      }
    }
    
    return true;
  });
  
  renderJobs(filteredJobs);
}

// Render jobs to the page
function renderJobs(jobs) {
  // Clear container
  jobsContainer.innerHTML = '';
  
  if (jobs.length === 0) {
    jobsContainer.innerHTML = `
      <div class="no-results">
        <h3>No jobs found</h3>
        <p>Try adjusting your search criteria</p>
      </div>
    `;
    return;
  }
  
  // Create job cards
  jobs.forEach(job => {
    const jobCard = document.createElement('div');
    jobCard.className = 'job-card';
    
    // Create categories HTML
    let categoriesHtml = '';
    if (job.categories && job.categories.length > 0) {
      categoriesHtml = `
        <div class="job-categories">
          ${job.categories.map(category => `
            <span class="job-category">${category}</span>
          `).join('')}
        </div>
      `;
    }
    
    // Format date
    let dateHtml = '';
    if (job.date_posted) {
      const jobDate = new Date(job.date_posted);
      const formattedDate = jobDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      
      dateHtml = `
        <div class="job-meta-item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
          </svg>
          ${formattedDate}
        </div>
      `;
    }
    
    jobCard.innerHTML = `
      <div class="job-content">
        <h3 class="job-title">${job.title || 'Untitled Position'}</h3>
        <div class="job-meta">
          <div class="job-meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm8 8v2h1v1H4v-1h1v-2a1 1 0 011-1h8a1 1 0 011 1z" clip-rule="evenodd" />
            </svg>
            ${job.company || 'Unknown Company'}
          </div>
          ${job.location ? `
            <div class="job-meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
              </svg>
              ${job.location}
            </div>
          ` : ''}
          ${dateHtml}
        </div>
        ${categoriesHtml}
        <a href="${job.url}" target="_blank" class="job-link">View Job</a>
      </div>
      <div class="job-footer">
        Source: ${job.source_website || 'Unknown Source'}
      </div>
    `;
    
    jobsContainer.appendChild(jobCard);
  });
}

// Show error message
function showError(message) {
  jobsContainer.innerHTML = `
    <div class="no-results" style="color: var(--error-color);">
      <h3>Error</h3>
      <p>${message}</p>
    </div>
  `;
}
