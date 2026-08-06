"""
OrdinalMK — Project Manager for TuIAlista Ecosystem
Add new projects to tuialista.com ecosystem with SEO optimization.
"""

import os
import json
import shutil
from pathlib import Path
from datetime import datetime

# Configuration
PROJECTS_DIR = Path(__file__).parent
TEMPLATE_DIR = PROJECTS_DIR / '_template'
DOMAIN = 'tuialista.com'

# Project status colors
STATUS_COLORS = {
    'live': ('#d4edda', '#155724'),
    'coming_soon': ('#fff3cd', '#856404'),
    'planning': ('#e2e3e5', '#383d41')
}


class ProjectManager:
    """Manage projects in the TuIAlista ecosystem."""
    
    def __init__(self):
        self.projects_dir = PROJECTS_DIR
    
    def add_project(self, project_id: str, config: dict) -> str:
        """Add a new project to the ecosystem."""
        project_dir = self.projects_dir / project_id
        
        if project_dir.exists():
            return f"Project {project_id} already exists"
        
        # Create project directory
        project_dir.mkdir(parents=True, exist_ok=True)
        
        # Copy template
        if TEMPLATE_DIR.exists():
            shutil.copytree(TEMPLATE_DIR, project_dir, dirs_exist_ok=True)
        
        # Generate index.html from template
        self._generate_landing_page(project_id, config)
        
        # Generate sitemap
        self._generate_project_sitemap(project_id, config)
        
        # Update ecosystem config
        self._update_ecosystem_config(project_id, config)
        
        return f"Project {project_id} created successfully"
    
    def _generate_landing_page(self, project_id: str, config: dict):
        """Generate landing page for a project."""
        template_path = TEMPLATE_DIR / 'index.html'
        
        if not template_path.exists():
            return
        
        template = template_path.read_text(encoding='utf-8')
        
        # Replace placeholders
        replacements = {
            '{{PROJECT_NAME}}': config.get('name', project_id.title()),
            '{{PROJECT_SLUG}}': project_id,
            '{{DESCRIPTION}}': config.get('concept', ''),
            '{{TAGLINE}}': config.get('tagline', ''),
            '{{KEYWORDS}}': ', '.join(config.get('keywords', {}).get('es', [])),
            '{{LOW_PRICE}}': str(min([p.get('price', 0) for p in config.get('products', [{'price': 0}]))] or 0),
            '{{HIGH_PRICE}}': str(max([p.get('price', 0) for p in config.get('products', [{'price': 0}])] or 0))
        }
        
        for placeholder, value in replacements.items():
            template = template.replace(placeholder, value)
        
        # Save
        project_dir = self.projects_dir / project_id
        project_dir.mkdir(parents=True, exist_ok=True)
        
        with open(project_dir / 'index.html', 'w', encoding='utf-8') as f:
            f.write(template)
    
    def _generate_project_sitemap(self, project_id: str, config: dict):
        """Generate sitemap for a project."""
        languages = config.get('languages', ['es', 'en'])
        path = config.get('path', f'/{project_id}')
        
        urls = []
        
        # Main page
        urls.append(f"""  <url>
    <loc>https://{DOMAIN}{path}/</loc>
    <lastmod>{datetime.now().strftime('%Y-%m-%d')}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>""")
        
        # Language versions
        for lang in languages:
            urls.append(f"""  <url>
    <loc>https://{DOMAIN}{path}/{lang}/</loc>
    <lastmod>{datetime.now().strftime('%Y-%m-%d')}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>""")
        
        sitemap = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
{chr(10).join(urls)}
</urlset>"""
        
        project_dir = self.projects_dir / project_id
        project_dir.mkdir(parents=True, exist_ok=True)
        
        with open(project_dir / 'sitemap.xml', 'w', encoding='utf-8') as f:
            f.write(sitemap)
    
    def _update_ecosystem_config(self, project_id: str, config: dict):
        """Update ecosystem configuration with new project."""
        config_file = PROJECTS_DIR / 'ecosystem_config.py'
        
        if not config_file.exists():
            return
        
        # Read current config
        content = config_file.read_text(encoding='utf-8')
        
        # Find the template section and add new project before it
        template_marker = "    # ──────────────────────────────────────────────\n    # TEMPLATE"
        
        new_project = f"""    # ──────────────────────────────────────────────
    # {config.get('name', project_id.upper())} — {config.get('concept', '')}
    # ──────────────────────────────────────────────
    '{project_id}': {{
        'name': '{config.get('name', project_id.title())}',
        'concept': '{config.get('concept', '')}',
        'tagline': '{config.get('tagline', '')}',
        'domain': '{DOMAIN}{config.get('path', f'/{project_id}')}',
        'path': '{config.get('path', f'/{project_id}')}',
        'languages': {config.get('languages', ['es', 'en'])},
        'primary_language': '{config.get('primary_language', 'es')}',
        'target_regions': {config.get('target_regions', ['LATAM'])},
        'target_audience': '{config.get('target_audience', '')}',
        'keywords': {{
            'es': {config.get('keywords', {}).get('es', [])},
            'en': {config.get('keywords', {}).get('en', [])}
        }},
        'content_topics': {{
            'es': {config.get('content_topics', {}).get('es', [])},
            'en': {config.get('content_topics', {}).get('en', [])}
        }},
        'products': {config.get('products', [])},
        'social_platforms': {config.get('social_platforms', ['instagram'])},
        'status': '{config.get('status', 'planning')}'
    }},
    
"""
        
        # Insert new project before template
        content = content.replace(template_marker, new_project + template_marker)
        
        # Save
        with open(config_file, 'w', encoding='utf-8') as f:
            f.write(content)
    
    def list_projects(self) -> dict:
        """List all projects in the ecosystem."""
        projects = {}
        
        for item in self.projects_dir.iterdir():
            if item.is_dir() and item.name != '_template' and not item.name.startswith('.'):
                projects[item.name] = {
                    'path': item,
                    'has_index': (item / 'index.html').exists(),
                    'has_sitemap': (item / 'sitemap.xml').exists()
                }
        
        return projects
    
    def generate_ecosystem_sitemap(self) -> str:
        """Generate main ecosystem sitemap."""
        urls = []
        
        # Main TuIAlista page
        urls.append(f"""  <url>
    <loc>https://{DOMAIN}/</loc>
    <lastmod>{datetime.now().strftime('%Y-%m-%d')}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>""")
        
        # Each project
        for project_id in self.list_projects().keys():
            if project_id == '_template':
                continue
            
            urls.append(f"""  <url>
    <loc>https://{DOMAIN}/{project_id}/</loc>
    <lastmod>{datetime.now().strftime('%Y-%m-%d')}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>""")
        
        sitemap = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{chr(10).join(urls)}
</urlset>"""
        
        sitemap_path = self.projects_dir.parent / 'sitemap.xml'
        with open(sitemap_path, 'w', encoding='utf-8') as f:
            f.write(sitemap)
        
        return str(sitemap_path)


# ──────────────────────────────────────────────────
# CLI
# ──────────────────────────────────────────────────
if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='TuIAlista Project Manager')
    parser.add_argument('command', choices=['list', 'add', 'sitemap'],
                       help='Command to execute')
    parser.add_argument('--project', '-p', help='Project ID (for add)')
    parser.add_argument('--name', '-n', help='Project name')
    parser.add_argument('--concept', '-c', help='Project concept')
    parser.add_argument('--path', help='URL path (e.g., /lastmile)')
    
    args = parser.parse_args()
    
    manager = ProjectManager()
    
    if args.command == 'list':
        projects = manager.list_projects()
        print(f"\nProjects in ecosystem ({len(projects)}):")
        for pid, info in projects.items():
            if pid == '_template':
                continue
            status = "OK" if info['has_index'] else "NO INDEX"
            print(f"  {pid}: {status}")
    
    elif args.command == 'add':
        if not args.project or not args.name:
            print("Error: --project and --name required")
            exit(1)
        
        config = {
            'name': args.name,
            'concept': args.concept or '',
            'path': args.path or f'/{args.project}',
            'languages': ['es', 'en'],
            'status': 'planning'
        }
        
        result = manager.add_project(args.project, config)
        print(result)
    
    elif args.command == 'sitemap':
        path = manager.generate_ecosystem_sitemap()
        print(f"Ecosystem sitemap generated: {path}")
