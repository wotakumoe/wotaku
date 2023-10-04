import time
import re

files = [
    "qs.md",
    "Websites.md",
    "Software.md",
    "misc.md",
    "addons.md",
    "jp.md",
    "merch.md",
    "Scanlation.md",
    "nsfw.md",
    "comms.md"
]

frontmatter = """---
label: Megathread
order: -100
icon: ":file_cabinet:"
---
# Megathread

"""

def remove_frontmatter(content: str) -> str:
    return re.sub(r'^---[\s\S]*?---', '', content, flags=re.MULTILINE)

def inc(match):
    heading_level = match.group(1)
    heading_text = match.group(2)
    new_heading_level = '#' * (len(heading_level) + 1)
    new_heading = f"{new_heading_level} {heading_text}"
    return new_heading


def increment_headings(content: str) -> str:
    return re.sub(r'^(#+)\s(.+)$', inc, content, flags=re.MULTILINE)

def output():
    content = ""
    for file in files:
            with open(file, "r") as f:
                filecont = f.read()
                newcont = increment_headings(remove_frontmatter(filecont))
                content += newcont
    return content

def main():
    content = output()
    with open("megathread.md", "w") as file:
        file.write(frontmatter + content)


if __name__ == "__main__":
    s = time.perf_counter()
    main()
    elapsed = time.perf_counter() - s
    print(f"{__file__} executed in {elapsed:0.2f} seconds.")
