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

def patch_quick_links(content: str) -> str:
    return re.sub(r'^# Quick Start', '## Quick Start', content, flags=re.MULTILINE)

def output():
    content = ""
    for file in files:
            with open(file, "r") as f:
                filecont = f.read()
                newcont = patch_quick_links(remove_frontmatter(filecont))
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
