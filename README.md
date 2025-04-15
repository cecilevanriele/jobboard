# Job Board Static Export

This directory contains a simplified version of the job board application that can be easily deployed to any web hosting service without requiring programming knowledge.

## Contents

- `index.html` - The main page that displays all job listings
- `css/` - Contains all styling for the application
- `js/` - Contains JavaScript files for search and filtering functionality
- `data/` - Contains the job listings data in JSON format
- `images/` - Contains logos and other images

## How to Deploy

### Option 1: Upload to Web Hosting

1. Download this entire directory to your computer
2. Log in to your web hosting control panel (e.g., cPanel, Plesk)
3. Navigate to the file manager or FTP section
4. Upload all files and folders from this directory to your web hosting
5. The job board will be available at your domain (e.g., yourdomain.com)

### Option 2: Deploy to GitHub Pages (Free)

1. Create a GitHub account if you don't have one
2. Create a new repository
3. Upload all files from this directory to the repository
4. Go to repository Settings > Pages
5. Enable GitHub Pages and select the main branch
6. Your job board will be available at username.github.io/repository-name

## Updating Job Listings

To update the job listings:

1. Run the included Python script: `python update_jobs.py`
2. This will scrape the latest jobs and update the `data/jobs.json` file
3. Upload the updated `data/jobs.json` file to your hosting

## Customization

To customize the appearance:

1. Edit the `css/styles.css` file to change colors, fonts, etc.
2. Replace the logo in `images/logo.png` with your own logo
3. Edit the `index.html` file to change text or layout

## Need Help?

If you need assistance with deployment or customization, consider:

1. Hiring a freelance web developer for a short consultation
2. Using a website builder service like Wix or Squarespace instead
3. Contacting your web hosting provider's support team
