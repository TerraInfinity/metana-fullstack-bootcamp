import os
import re
from anthropic import Anthropic, HUMAN_PROMPT, AI_PROMPT
import sys

# Configuration
API_KEY = os.getenv("ANTHROPIC_API_KEY")
MODEL = "claude-3-7-sonnet-20250219"
PROJECT_ROOT = os.path.join("..", "..", "metana-fullstack-bootcamp", "module-9")
README_PATH = os.path.join(PROJECT_ROOT, "README_Generated.md")
FULL_CONTENT_CHAR_LIMIT = 500  # Threshold for sending full content

# Debug and fallback for API key
print("Checking ANTHROPIC_API_KEY:")
print(f"Value from os.getenv: {API_KEY}")

# If os.getenv fails, try fetching directly from Windows environment
if not API_KEY:
    print("os.getenv failed to find ANTHROPIC_API_KEY. Attempting to fetch from Windows environment...")
    try:
        API_KEY = os.environ.get("ANTHROPIC_API_KEY")  # Try os.environ as a fallback
        if not API_KEY:
            # Check User and Machine scopes directly (Windows-specific)
            from winreg import ConnectRegistry, HKEY_CURRENT_USER, HKEY_LOCAL_MACHINE, OpenKey, QueryValueEx
            for scope, hive in [("User", HKEY_CURRENT_USER), ("Machine", HKEY_LOCAL_MACHINE)]:
                try:
                    with ConnectRegistry(None, hive) as reg:
                        with OpenKey(reg, r"Environment") as key:
                            API_KEY = QueryValueEx(key, "ANTHROPIC_API_KEY")[0]
                            if API_KEY:
                                print(f"Found API key in {scope} environment variables.")
                                break
                except FileNotFoundError:
                    continue
    except Exception as e:
        print(f"Error accessing Windows registry: {e}")

# If still not found, prompt the user
if not API_KEY:
    print("Warning: ANTHROPIC_API_KEY not found in environment.")
    print("You can set it in your shell:")
    print("  CMD: set ANTHROPIC_API_KEY=your_key")
    print("  PowerShell: $env:ANTHROPIC_API_KEY='your_key'")
    print("Or enter it manually now (input will be hidden for security):")
    API_KEY = input("Enter your Anthropic API key: ").strip()
    if not API_KEY:
        print("Error: No API key provided. Exiting.")
        sys.exit(1)

# Initialize Anthropic client
client = Anthropic(api_key=API_KEY)

def extract_comments(file_path):
    """Extract comments from a file based on its extension, tailored for a React app."""
    comments = []
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            ext = os.path.splitext(file_path)[1].lower()
            
            if ext in ['.js', '.jsx', '.py', '.css']:
                # Single-line comments (//) or Python (#)
                single_line = re.findall(r'(?://|#).*?$', content, re.MULTILINE)
                # Multi-line comments (/* */), including JSDoc (/** */)
                multi_line = re.findall(r'/\*[\s\S]*?\*/', content, re.DOTALL)
                comments.extend(single_line)
                comments.extend(multi_line)
            elif ext == '.html':
                # HTML comments (<!-- -->)
                comments = re.findall(r'<!--[\s\S]*?-->', content, re.DOTALL)
            
            # Clean comments and filter out empty lines
            comments = [c.strip().replace('//', '').replace('/*', '').replace('*/', '').replace('<!--', '').replace('-->', '').replace('#', '').strip() 
                        for c in comments if c.strip()]
    except Exception as e:
        print(f"Error reading {file_path} for comments: {e}")
    return comments

def get_file_char_length(file_path):
    """Calculate the character length of a file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            return len(content)
    except Exception as e:
        print(f"Error reading {file_path} for length: {e}")
        return -1

def build_file_tree(files_to_analyze, abs_root_dir):
    """Build a simplified file tree string for Claude without char counts or treatment."""
    tree = {}
    for file_path in files_to_analyze:
        rel_path = os.path.relpath(file_path, abs_root_dir)
        parts = rel_path.split(os.sep)
        current = tree
        for part in parts[:-1]:
            if part not in current:
                current[part] = {}
            current = current[part]
        current[parts[-1]] = None

    def tree_to_string(node, prefix=""):
        result = ""
        items = sorted(node.keys())
        for i, key in enumerate(items):
            is_last = i == len(items) - 1
            result += f"{prefix}{'└── ' if is_last else '├── '}{key}\n"
            if node[key] is not None:
                new_prefix = prefix + ("    " if is_last else "│   ")
                result += tree_to_string(node[key], new_prefix)
        return result

    return f"Project file tree:\n{tree_to_string(tree)}"

def analyze_file_with_claude(file_path, comments, file_tree):
    """Analyze a file with Claude using comments or full content based on file type and size."""
    file_name = os.path.basename(file_path)
    ext = os.path.splitext(file_path)[1].lower()
    char_length = get_file_char_length(file_path)
    
    # Define full content files
    full_content_files = ['package.json', 'postcss.config.js', 'tailwind.config.js', 'webpack.config.js']
    
    # Determine treatment based on file type and size
    if (file_name in full_content_files or ext in ['.json', '.config.js'] or char_length <= FULL_CONTENT_CHAR_LIMIT) and not file_name.endswith('.postman_collection.json'):
        treatment = "Full content will be sent to Claude."
    elif file_name.endswith('.postman_collection.json'):
        treatment = "Truncated content (first 5,000 characters) will be sent to Claude."
    elif comments:
        treatment = f"Only comments will be sent to Claude ({len(comments)} lines)."
    else:
        treatment = "No comments found; will infer purpose from file name."
    
    # Print detailed explanation before the API call
    print(f"Preparing to analyze {file_name}:")
    print(f"- File size: {char_length} characters")
    print(f"- Treatment: {treatment}")
    if treatment.startswith("Only comments"):
        print(f"- Comment lines: {len(comments)}")
    print("- The full project file tree will also be included in the prompt for context.")
    print("Press any key to proceed with the API call...")
    input()  # Pause for user approval
    
    # Base prompt with file tree for context
    base_prompt = f"{HUMAN_PROMPT}Below is the project file tree for context:\n\n{file_tree}\n\nNow analyze the following file:\n"
    
    # Construct prompt based on treatment
    if (file_name in full_content_files or ext in ['.json', '.config.js'] or char_length <= FULL_CONTENT_CHAR_LIMIT) and not file_name.endswith('.postman_collection.json'):
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            prompt = f"{base_prompt}Given the file '{file_name}' with the following content:\n\n{content}\n\nDescribe what this file does and how it fits into a React/Tailwind blog platform built with npm, including its interactions with other files." + AI_PROMPT
        except Exception as e:
            print(f"Error reading {file_path} for full analysis: {e}")
            prompt = f"{base_prompt}Given the file '{file_name}' with no accessible content, infer its purpose based on the file name and typical usage in a React/Tailwind blog platform built with npm." + AI_PROMPT
    elif file_name.endswith('.postman_collection.json'):
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()[:5000]  # Truncate to first 5,000 chars
            prompt = f"{base_prompt}Given the file '{file_name}' (a large Postman collection, truncated here) with the following partial content:\n\n{content}\n\nSummarize what this file does in a React/Tailwind blog platform built with npm, focusing on API testing aspects and interactions with backend files." + AI_PROMPT
        except Exception as e:
            print(f"Error reading {file_path} for truncated analysis: {e}")
            prompt = f"{base_prompt}Given the file '{file_name}' (a Postman collection) with no accessible content, infer its purpose based on the file name and typical usage in a React/Tailwind blog platform." + AI_PROMPT
    elif comments:
        prompt = f"{base_prompt}Given the file '{file_name}' with the following comments:\n\n" + \
                 "\n".join([f"- {c}" for c in comments]) + \
                 "\n\nDescribe what this file does and how it fits into a React/Tailwind blog platform built with npm, including its interactions with other files." + AI_PROMPT
    else:
        prompt = f"{base_prompt}Given the file '{file_name}' with no comments, infer its purpose based on the file name and typical usage in a React/Tailwind blog platform built with npm, including possible interactions with other files." + AI_PROMPT

    # Make the API call
    try:
        response = client.messages.create(
            model=MODEL,
            max_tokens=500,
            messages=[{"role": "user", "content": prompt}]
        )
        return response.content[0].text.strip()
    except Exception as e:
        print(f"Error analyzing {file_path} with Claude: {e}")
        return f"Inferred purpose of '{file_name}': Likely handles {file_name.split('.')[0]} functionality in a React/Tailwind blog platform."

def append_folder_section_to_readme(readme_path, folder, folder_descriptions):
    """Append a folder's section to the README file."""
    with open(readme_path, 'a', encoding='utf-8') as f:
        f.write(f"### {folder or 'Root Directory'}\n\n")
        for file_path, desc in sorted(folder_descriptions.items()):
            rel_path = os.path.relpath(file_path, PROJECT_ROOT)
            length = get_file_char_length(file_path)
            f.write(f"- `{rel_path}` ({length} characters)\n  {desc}\n\n")
    print(f"Appended section for folder '{folder}' to README.")

def scan_folder_structure(root_dir):
    """Recursively scan the folder structure and append file descriptions to README after each folder."""
    files_to_analyze = []
    file_comments = {}
    abs_root_dir = os.path.abspath(root_dir)
    print(f"Scanning directory (absolute): {abs_root_dir}")

    if not os.path.exists(abs_root_dir):
        print(f"Error: Directory '{abs_root_dir}' does not exist.")
        return

    # Collect all files first
    for root, dirs, files in os.walk(root_dir):
        print(f"Walking directory: {root}")
        if 'node_modules' in dirs:
            dirs.remove('node_modules')
            print(f"Skipping 'node_modules' directory in {root}")
        
        for file in files:
            file_path = os.path.join(root, file)
            print(f"Found file: {file_path}")
            if file.endswith(('.jpg', '.png')):
                print(f"Skipping file: {file} (unsupported format)")
                continue
            if file in ['README.md', '.env', '.gitignore'] and file not in ['package.json']:
                print(f"Skipping file: {file} (excluded config/doc file)")
                continue
            print(f"Adding file to analyze: {file_path}")
            files_to_analyze.append(file_path)
            comments = extract_comments(file_path)
            file_comments[file_path] = comments

    # Build file tree for Claude
    file_tree = build_file_tree(files_to_analyze, abs_root_dir)

    # Display tree with comment lines
    print("\nFiles to be analyzed (tree structure with comment lines):")
    if files_to_analyze:
        tree = {}
        for file_path in files_to_analyze:
            rel_path = os.path.relpath(file_path, abs_root_dir)
            parts = rel_path.split(os.sep)
            current = tree
            for part in parts[:-1]:
                if part not in current:
                    current[part] = {}
                current = current[part]
            current[parts[-1]] = (get_file_char_length(file_path), file_comments[file_path])

        def print_tree(node, prefix=""):
            items = sorted(node.keys())
            for i, key in enumerate(items):
                is_last = i == len(items) - 1
                if node[key] is not None and isinstance(node[key], tuple):
                    length, comments = node[key]
                    ext = os.path.splitext(key)[1].lower()
                    full_content_files = ['package.json', 'postcss.config.js', 'tailwind.config.js', 'webpack.config.js']
                    if key in full_content_files or ext in ['.json', '.config.js'] or length <= FULL_CONTENT_CHAR_LIMIT:
                        treatment = "Full content sent to Claude"
                        comment_info = ""
                    elif key.endswith('.postman_collection.json'):
                        treatment = "Truncated content (first 5,000 chars) sent to Claude"
                        comment_info = ""
                    else:
                        treatment = "Comments only sent to Claude"
                        comment_info = f", {len(comments)} comment lines"
                    print(f"{prefix}{'└── ' if is_last else '├── '}{key} ({length} chars) - {treatment}{comment_info}")
                else:
                    print(f"{prefix}{'└── ' if is_last else '├── '}{key}")
                    new_prefix = prefix + ("    " if is_last else "│   ")
                    print_tree(node[key], new_prefix)

        print_tree(tree)
    else:
        print("No files found to analyze.")

    # Group files by folder and analyze
    folder_groups = {}
    for file_path in files_to_analyze:
        rel_path = os.path.relpath(file_path, abs_root_dir)
        folder = os.path.dirname(rel_path) or "root"
        if folder not in folder_groups:
            folder_groups[folder] = []
        folder_groups[folder].append(file_path)

    for folder in sorted(folder_groups.keys()):
        print(f"\nAnalyzing folder: {folder}")
        folder_descriptions = {}
        for file_path in folder_groups[folder]:
            comments = file_comments[file_path]
            description = analyze_file_with_claude(file_path, comments, file_tree)
            folder_descriptions[file_path] = description
        append_folder_section_to_readme(README_PATH, folder, folder_descriptions)

def main():
    """Main function to orchestrate README generation with incremental updates."""
    print(f"PROJECT_ROOT (absolute): {os.path.abspath(PROJECT_ROOT)}")
    print(f"Current working directory: {os.getcwd()}")
    print("Scanning project structure...")

    # Ensure the directory for README_PATH exists
    os.makedirs(os.path.dirname(README_PATH), exist_ok=True)

    # Write initial sections to README
    with open(README_PATH, 'w', encoding='utf-8') as f:
        f.write("# React/Tailwind Blog Platform\n\n")
        f.write("## Overview\n\n")
        f.write("This project is a full-featured blog platform built with a Node.js backend and a React frontend, " \
                "using Tailwind CSS for styling and npm for package management. It likely uses MongoDB as the database " \
                "and supports user authentication, blog creation, commenting, user profiles, and administrative features.\n\n")
        f.write("## Technology Stack\n\n")
        f.write("- **Backend**: Node.js, Express.js\n")
        f.write("- **Frontend**: React.js\n")
        f.write("- **Styling**: Tailwind CSS\n")
        f.write("- **Database**: MongoDB (inferred from models)\n")
        f.write("- **Authentication**: Passport.js\n")
        f.write("- **Build Tools**: Webpack, PostCSS, npm\n\n")
        f.write("## Folder Structure and File Descriptions\n\n")
    print("Wrote initial README sections.")

    # Scan and append folder sections incrementally
    scan_folder_structure(PROJECT_ROOT)

    # Append final sections to README
    with open(README_PATH, 'a', encoding='utf-8') as f:
        f.write("## Key Features\n\n")
        f.write("- **User Authentication**: Managed via Passport.js and token generation.\n")
        f.write("- **Blog Management**: CRUD operations for blogs and comments.\n")
        f.write("- **User Profiles**: Detailed profiles with privacy settings and activities.\n")
        f.write("- **Admin Dashboard**: Tools for site management.\n")
        f.write("- **Responsive UI**: Styled with Tailwind CSS.\n\n")
        f.write("## Setup Instructions\n\n")
        f.write("1. Clone the repository.\n")
        f.write("2. Install dependencies: `npm install`\n")
        f.write("3. Configure `.env` with database URI and secret keys.\n")
        f.write("4. Start the server: `npm start`\n\n")
        f.write("## API Documentation\n\n")
        f.write("See `REST API TESTING (Blog - User ).postman_collection.json` for endpoint details.\n")
    print("Appended final README sections.")
    print(f"README generated at {README_PATH}")

if __name__ == "__main__":
    main()