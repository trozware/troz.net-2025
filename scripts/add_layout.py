import os

posts_folder = "src/posts"

for year in os.listdir(posts_folder):
    # skip hidden files
    if year.startswith("."):
        continue

    for post in os.listdir(os.path.join(posts_folder, year)):
        if post.endswith(".md"):
            with open(os.path.join(posts_folder, year, post), "r") as f:
                content = f.read()

            if "layout: 'layouts/post.njk'" not in content:
                # find the second instance of "---"
                start = content.find("---", content.find("---") + 1)
                end = content.find("---", start + 3)
                content = content[:start] + "layout: 'layouts/post.njk'\n" + content[start:end] + content[end:]

            if "categories:" not in content:
                # replace 'tags:' with 'categories:'
                content = content.replace("tags:", "categories:")

            if "tags:" not in content:
                # add tags: [] before the second instance of "---"
                start = content.find("---", content.find("---") + 1)
                end = content.find("---", start + 3)
                content = content[:start] + "tags: [" + year + "]\n" + content[start:end] + content[end:]

            with open(os.path.join(posts_folder, year, post), "w") as f:
                f.write(content)
