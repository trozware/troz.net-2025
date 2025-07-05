#!/usr/bin/env python3
"""
Script to check all image links in Markdown files and report missing ones.
"""

import os
import re
import glob
from pathlib import Path

def find_markdown_files(post_dir):
    """Find all Markdown files in the post directory."""
    markdown_files = []
    for year_dir in os.listdir(post_dir):
        year_path = os.path.join(post_dir, year_dir)
        if os.path.isdir(year_path):
            for file in os.listdir(year_path):
                if file.endswith('.md'):
                    markdown_files.append(os.path.join(year_path, file))
    return markdown_files

def extract_image_links(markdown_content):
    """Extract all image links from Markdown content."""
    # Match both ![alt](url) and <img src="url"> patterns
    patterns = [
        r'!\[([^\]]*)\]\(([^)]+)\)',  # ![alt](url)
        r'<img[^>]+src=["\']([^"\']+)["\'][^>]*>',  # <img src="url">
        r'!\[([^\]]*)\]\(([^)]+)\)',  # ![alt](url) with spaces
    ]
    
    image_links = []
    for pattern in patterns:
        matches = re.findall(pattern, markdown_content)
        for match in matches:
            if isinstance(match, tuple):
                # For ![alt](url) pattern, match[1] is the URL
                url = match[1]
            else:
                # For <img> pattern, match is the URL
                url = match
            image_links.append(url.strip())
    
    return image_links

def check_image_exists(image_path, base_dir):
    """Check if an image file exists."""
    # Handle different path formats
    if image_path.startswith('/'):
        # Absolute path from site root
        full_path = os.path.join(base_dir, 'src', image_path[1:])
    elif image_path.startswith('./'):
        # Relative path
        full_path = os.path.join(base_dir, 'src', image_path[2:])
    elif image_path.startswith('../'):
        # Parent directory
        full_path = os.path.join(base_dir, 'src', image_path[3:])
    else:
        # Assume relative to src directory
        full_path = os.path.join(base_dir, 'src', image_path)
    
    return os.path.exists(full_path), full_path

def main():
    # Get the workspace root (assuming script is in scripts/ directory)
    workspace_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    post_dir = os.path.join(workspace_root, 'src', 'post')
    
    print("Checking image links in Markdown files...")
    print(f"Post directory: {post_dir}")
    print("-" * 50)
    
    markdown_files = find_markdown_files(post_dir)
    print(f"Found {len(markdown_files)} Markdown files")
    
    missing_images = []
    total_images = 0
    
    for file_path in markdown_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            image_links = extract_image_links(content)
            if image_links:
                print(f"\nChecking: {os.path.basename(file_path)}")
                print(f"  Found {len(image_links)} image links")
                
                for image_link in image_links:
                    total_images += 1
                    exists, full_path = check_image_exists(image_link, workspace_root)
                    
                    if not exists:
                        missing_images.append({
                            'file': file_path,
                            'image_link': image_link,
                            'full_path': full_path
                        })
                        print(f"    ❌ Missing: {image_link}")
                    else:
                        print(f"    ✅ Found: {image_link}")
        
        except Exception as e:
            print(f"Error reading {file_path}: {e}")
    
    print("\n" + "=" * 50)
    print("SUMMARY")
    print("=" * 50)
    print(f"Total images checked: {total_images}")
    print(f"Missing images: {len(missing_images)}")
    
    if missing_images:
        print("\nMISSING IMAGES:")
        print("-" * 30)
        for item in missing_images:
            print(f"File: {os.path.basename(item['file'])}")
            print(f"  Image: {item['image_link']}")
            print(f"  Expected path: {item['full_path']}")
            print()
    else:
        print("\n✅ All image links are valid!")

if __name__ == "__main__":
    main() 