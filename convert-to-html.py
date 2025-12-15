#!/usr/bin/env python3
"""
Convert Markdown files to HTML with professional styling
"""

import re
import os

HTML_TEMPLATE = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
            padding: 20px;
        }}
        .container {{
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            border-radius: 8px;
        }}
        h1 {{
            color: #2c3e50;
            border-bottom: 4px solid #3498db;
            padding-bottom: 15px;
            margin-bottom: 30px;
            font-size: 2.5em;
        }}
        h2 {{
            color: #2980b9;
            margin-top: 40px;
            margin-bottom: 20px;
            font-size: 1.8em;
            border-left: 5px solid #3498db;
            padding-left: 15px;
        }}
        h3 {{
            color: #34495e;
            margin-top: 25px;
            margin-bottom: 15px;
            font-size: 1.3em;
        }}
        p {{ margin: 15px 0; }}
        ul, ol {{ margin: 15px 0 15px 30px; }}
        li {{ margin: 8px 0; }}
        table {{
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 0.95em;
        }}
        th {{
            background: #3498db;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 600;
        }}
        td {{
            padding: 12px;
            border-bottom: 1px solid #e0e0e0;
        }}
        tr:hover {{ background: #f8f9fa; }}
        .highlight {{
            background: #fff3cd;
            padding: 2px 6px;
            border-radius: 3px;
            font-weight: bold;
        }}
        .warning {{
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }}
        strong {{ color: #2c3e50; }}
        code {{
            background: #f4f4f4;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }}
        hr {{
            margin: 40px 0;
            border: none;
            border-top: 2px solid #e0e0e0;
        }}
        a {{ color: #2980b9; text-decoration: none; }}
        a:hover {{ text-decoration: underline; }}
        @media print {{
            body {{ background: white; padding: 0; }}
            .container {{ box-shadow: none; }}
        }}
    </style>
</head>
<body>
    <div class="container">
        {content}
        <hr>
        <p style="text-align: center; color: #7f8c8d; margin-top: 40px;">
            <a href="index.html">← Back to Main Page</a><br>
            Syria Ministry of Interior PA System Project - January 2025
        </p>
    </div>
</body>
</html>
'''

def md_to_html(md_text):
    """Convert markdown to HTML"""
    html = md_text

    # Headers
    html = re.sub(r'^# (.+)$', r'<h1>\1</h1>', html, flags=re.MULTILINE)
    html = re.sub(r'^## (.+)$', r'<h2>\1</h2>', html, flags=re.MULTILINE)
    html = re.sub(r'^### (.+)$', r'<h3>\1</h3>', html, flags=re.MULTILINE)

    # Bold and italic
    html = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', html)
    html = re.sub(r'\*(.+?)\*', r'<em>\1</em>', html)

    # Code
    html = re.sub(r'`([^`]+)`', r'<code>\1</code>', html)

    # Links
    html = re.sub(r'\[([^\]]+)\]\(([^\)]+)\)', r'<a href="\2">\1</a>', html)

    # Horizontal rules
    html = re.sub(r'^---+$', '<hr>', html, flags=re.MULTILINE)

    # Lists
    lines = html.split('\n')
    new_lines = []
    in_list = False

    for line in lines:
        if re.match(r'^- ', line):
            if not in_list:
                new_lines.append('<ul>')
                in_list = 'ul'
            new_lines.append(f'<li>{line[2:]}</li>')
        elif re.match(r'^\d+\. ', line):
            if not in_list:
                new_lines.append('<ol>')
                in_list = 'ol'
            cleaned_line = re.sub(r"^\d+\. ", "", line)
            new_lines.append(f'<li>{cleaned_line}</li>')
        else:
            if in_list:
                new_lines.append(f'</{in_list}>')
                in_list = False
            if line.strip() and not line.startswith('<'):
                new_lines.append(f'<p>{line}</p>')
            else:
                new_lines.append(line)

    if in_list:
        new_lines.append(f'</{in_list}>')

    return '\n'.join(new_lines)

def convert_file(md_file, html_file):
    """Convert a markdown file to HTML"""
    print(f"Converting {md_file} to {html_file}...")

    with open(md_file, 'r', encoding='utf-8') as f:
        md_content = f.read()

    # Get title from first H1
    title_match = re.search(r'^# (.+)$', md_content, re.MULTILINE)
    title = title_match.group(1) if title_match else "Syria PA System"

    # Convert to HTML
    html_content = md_to_html(md_content)

    # Apply template
    full_html = HTML_TEMPLATE.format(title=title, content=html_content)

    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(full_html)

    print(f"✓ Created {html_file}")

# Convert all markdown files
files_to_convert = [
    ('Complete-Shopping-List.md', 'Complete-Shopping-List.html'),
    ('Quick-Package-Comparison.md', 'Quick-Package-Comparison.html'),
    ('Technical-Specifications-Reference.md', 'Technical-Specifications-Reference.html'),
    ('Frequency-Verification-Guide.md', 'Frequency-Verification-Guide.html'),
    ('Purchase-Order-Template.md', 'Purchase-Order-Template.html'),
    ('Vendor-RFQ-Technical-Requirements.md', 'Vendor-RFQ-Technical-Requirements.html'),
]

script_dir = os.path.dirname(os.path.abspath(__file__))

for md_file, html_file in files_to_convert:
    md_path = os.path.join(script_dir, md_file)
    html_path = os.path.join(script_dir, html_file)

    if os.path.exists(md_path):
        convert_file(md_path, html_path)
    else:
        print(f"Warning: {md_file} not found")

print("\n✓ All files converted successfully!")
print("Open index.html in your browser to view the project.")
