# Python script to create a new post in the src/post directory
# It will create the directory and file and add the necessary front matter

import os
import datetime

os.chdir(os.path.dirname(os.path.abspath(__file__)))
year = datetime.datetime.now().year

title = input("Enter the title of the post: ")
if title == "":
    print("Title is required")
    exit()

filename = title.lower().replace(" ", "-")

file_content = f"""---
title: "{title}"
date: {datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
layout: layouts/post.njk
draft: true
categories: []
---


<!--more-->

"""

os.makedirs(f"../src/post/{year}", exist_ok=True)

with open(f"../src/post/{year}/{filename}.md", "w") as f:
    f.write(file_content)

print(f"Created {year}/{filename}.md")
