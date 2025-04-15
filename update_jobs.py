#!/usr/bin/env python3
"""
Simple script to update job listings for the static job board.
This script scrapes job listings from the target websites and saves them to a JSON file.
"""

import os
import json
import logging
import datetime
from typing import List

# Import scrapers
from scraper.unikidz_scraper import UnikidzScraper
from scraper.investree_scraper import InvestreeScraper
from scraper.tover_scraper import ToverScraper
from scraper.jopenbier_scraper import JopenBierScraper
from scraper.bpiservices_scraper import BPIServicesScraper
from scraper.models import JobListing

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("scraper.log"),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger("update_jobs")

def run_scrapers() -> List[JobListing]:
    """Run all scrapers and return combined job listings."""
    all_jobs = []
    
    # Initialize scrapers
    scrapers = [
        UnikidzScraper(),
        InvestreeScraper(),
        ToverScraper(),
        JopenBierScraper(),
        BPIServicesScraper()
    ]
    
    # Run each scraper
    for scraper in scrapers:
        try:
            logger.info(f"Running scraper for {scraper.website_name}")
            jobs = scraper.scrape_job_listings()
            logger.info(f"Found {len(jobs)} jobs from {scraper.website_name}")
            all_jobs.extend(jobs)
        except Exception as e:
            logger.error(f"Error running scraper for {scraper.website_name}: {str(e)}")
    
    return all_jobs

def save_jobs_to_json(jobs: List[JobListing], output_path: str) -> None:
    """Save job listings to a JSON file."""
    # Create directory if it doesn't exist
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # Convert jobs to dictionaries
    job_dicts = []
    for i, job in enumerate(jobs):
        job_dict = job.to_dict()
        job_dict['id'] = i + 1  # Add ID for frontend
        job_dicts.append(job_dict)
    
    # Write to file
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(job_dicts, f, indent=2, default=str)
    
    logger.info(f"Saved {len(jobs)} jobs to {output_path}")

def main():
    """Main function to run scrapers and save results."""
    logger.info("Starting job update process")
    
    # Run scrapers
    jobs = run_scrapers()
    logger.info(f"Total jobs found: {len(jobs)}")
    
    # Save to JSON
    output_path = "data/jobs.json"
    save_jobs_to_json(jobs, output_path)
    
    # Update last updated date
    with open("data/last_updated.txt", "w") as f:
        f.write(datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    
    logger.info("Job update process completed successfully")

if __name__ == "__main__":
    main()
