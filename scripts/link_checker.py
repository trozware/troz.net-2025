import requests
import os
from bs4 import BeautifulSoup
pages = []
broken_links = []
# loop through all the .html files in the public directory and all its subdirectories
for root, dirs, files in os.walk("public"):
	for file in files:
		if file.endswith(".html"):
			pages.append(f"http://localhost:8080/{os.path.join(root, file)}")

# for each HTML file, find all the external links
links_to_check = set()
for page in pages:
	r = requests.get(page)
	soup = BeautifulSoup(r.text, "html.parser")
	links = soup.find_all("a")
	for link in links:
		if link.get("href").startswith("http"):
			links_to_check.add(link.get("href"))

print('Checking ' + str(len(links_to_check)) + ' links...')
for link in links_to_check:
	r = requests.get(link)
	print(link + " " + str(r.status_code))
	if r.status_code != 200:
		broken_links.append(link)


print('Found ' + str(len(broken_links)) + ' broken links.')
for link in broken_links:
	print(link)
	

