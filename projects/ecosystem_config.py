"""
OrdinalMK — Multi-Project Configuration
Defines all projects under tuialista.com ecosystem.
Each project is a subdirectory with its own content, audience, and SEO.
"""

# --------------------------------------------------
# ECOSYSTEM CONFIGURATION
# --------------------------------------------------
ECOSYSTEM = {
    'domain': 'tuialista.com',
    'brand': 'TuIAlista',
    'tagline': 'Agentes de IA que trabajan dentro de tu negocio',
    'languages': ['es', 'en', 'pt', 'fr', 'de', 'it'],
    'default_language': 'es',
    'analytics': 'plausible',
    'search_console': True
}

# --------------------------------------------------
# PROJECTS CONFIGURATION
# --------------------------------------------------
PROJECTS = {
    # ──────────────────────────────────────────────
    # LASTMILE — Delivery & Logistics
    # ──────────────────────────────────────────────
    'lastmile': {
        'name': 'LastMile',
        'concept': 'Plataforma de entrega y logística para LATAM',
        'tagline': 'Entregas ráctigas y seguras para tu negocio',
        'domain': 'tuialista.com/lastmile',
        'path': '/lastmile',
        'languages': ['es', 'en', 'pt'],
        'primary_language': 'es',
        'target_regions': ['LATAM', 'USA'],
        'target_audience': 'Negocios de entrega, restaurantes, e-commerce',
        'keywords': {
            'es': ['entrega a domicilio', 'logística', 'last mile delivery', 'envíos México'],
            'en': ['delivery service', 'logistics', 'last mile delivery', 'shipping LATAM'],
            'pt': ['entrega', 'logística', 'última milha', 'entregas Brasil']
        },
        'content_topics': {
            'es': ['Cómo optimizar entregas', 'Logística para restaurantes', 'Entregas el mismo día'],
            'en': ['How to optimize deliveries', 'Restaurant logistics', 'Same-day delivery'],
            'pt': ['Como otimizar entregas', 'Logística para restaurantes', 'Entrega no mesmo dia']
        },
        'products': [
            {'name': 'LastMile Starter', 'price': 49, 'currency': 'USD'},
            {'name': 'LastMile Pro', 'price': 149, 'currency': 'USD'},
            {'name': 'LastMile Enterprise', 'price': 399, 'currency': 'USD'}
        ],
        'social_platforms': ['instagram', 'linkedin', 'facebook'],
        'status': 'coming_soon'
    },
    
    # ──────────────────────────────────────────────
    # NOC MONITOR — Network Operations Center
    # ──────────────────────────────────────────────
    'nocmonitor': {
        'name': 'NOC Monitor',
        'concept': 'Monitoreo global de infraestructura IT',
        'tagline': 'Monitorea tu infraestructura desde cualquier lugar',
        'domain': 'tuialista.com/nocmonitor',
        'path': '/nocmonitor',
        'languages': ['es', 'en'],
        'primary_language': 'en',
        'target_regions': ['Global'],
        'target_audience': 'Empresas con infraestructura IT, MSPs, Data Centers',
        'keywords': {
            'es': ['monitoreo IT', 'NOC', 'infraestructura', 'alertas servidor'],
            'en': ['NOC monitoring', 'IT infrastructure', 'server monitoring', 'network operations']
        },
        'content_topics': {
            'es': ['Cómo monitorear servidores', 'Alertas de infraestructura', 'Mejores prácticas NOC'],
            'en': ['How to monitor servers', 'Infrastructure alerts', 'NOC best practices']
        },
        'products': [
            {'name': 'Monitor Basic', 'price': 29, 'currency': 'USD'},
            {'name': 'Monitor Pro', 'price': 99, 'currency': 'USD'},
            {'name': 'Monitor Enterprise', 'price': 299, 'currency': 'USD'}
        ],
        'social_platforms': ['linkedin', 'twitter'],
        'status': 'coming_soon'
    },
    
    # ──────────────────────────────────────────────
    # YAYIKA — Products for Women (already exists)
    # ──────────────────────────────────────────────
    'yayika': {
        'name': 'Yayika',
        'concept': 'Productos digitales para mujeres emprendedoras',
        'tagline': 'Tu negocio, tu forma',
        'domain': 'yayika.com',
        'path': '/yayika',
        'languages': ['es', 'en', 'pt', 'fr', 'de'],
        'primary_language': 'es',
        'target_regions': ['LATAM', 'USA', 'Europa'],
        'target_audience': 'Mujeres emprendedoras',
        'keywords': {
            'es': ['mujeres emprendedoras', 'productividad femenina', 'finanzas mujeres'],
            'en': ['women entrepreneurs', 'female productivity', 'women finance'],
            'pt': ['empreendedoras', 'produtividade feminina', 'finanças mulheres']
        },
        'content_topics': {
            'es': ['Productividad femenina', 'Finanzas para mujeres', 'Negociación salarial'],
            'en': ['Women productivity', 'Finance for women', 'Salary negotiation'],
            'pt': ['Produtividade feminina', 'Finanças para mulheres', 'Negociação salarial']
        },
        'products': [
            {'name': 'Semilla', 'price': 99, 'currency': 'MXN'},
            {'name': 'Guerrera', 'price': 199, 'currency': 'MXN'},
            {'name': 'Diamante', 'price': 349, 'currency': 'MXN'}
        ],
        'social_platforms': ['instagram', 'facebook', 'tiktok'],
        'status': 'live',
        'external_url': 'https://yayika.com'
    },
    
    # ──────────────────────────────────────────────
    # TEMPLATE — Copy this for new projects
    # ──────────────────────────────────────────────
    '_template': {
        'name': 'Project Name',
        'concept': 'Brief description of the project',
        'tagline': 'Short tagline',
        'domain': 'tuialista.com/project-name',
        'path': '/project-name',
        'languages': ['es', 'en'],
        'primary_language': 'es',
        'target_regions': ['LATAM'],
        'target_audience': 'Target audience description',
        'keywords': {
            'es': ['keyword 1', 'keyword 2'],
            'en': ['keyword 1', 'keyword 2']
        },
        'content_topics': {
            'es': ['Topic 1', 'Topic 2'],
            'en': ['Topic 1', 'Topic 2']
        },
        'products': [
            {'name': 'Product Name', 'price': 0, 'currency': 'USD'}
        ],
        'social_platforms': ['instagram'],
        'status': 'planning'
    }
}


# ──────────────────────────────────────────────────
# HELPER FUNCTIONS
# ──────────────────────────────────────────────────

def get_active_projects():
    """Get all active (live or coming_soon) projects."""
    return {
        k: v for k, v in PROJECTS.items() 
        if k != '_template' and v['status'] in ['live', 'coming_soon']
    }

def get_project(project_id):
    """Get a specific project configuration."""
    return PROJECTS.get(project_id)

def get_all_languages():
    """Get all unique languages across all projects."""
    languages = set()
    for k, v in PROJECTS.items():
        if k != '_template':
            languages.update(v['languages'])
    return sorted(languages)

def get_ecosystem_sitemap_urls():
    """Generate sitemap URLs for all projects."""
    urls = []
    domain = ECOSYSTEM['domain']
    
    for project_id, config in get_active_projects().items():
        if project_id == '_template':
            continue
        
        # Main page
        urls.append(f"https://{domain}{config['path']}/")
        
        # Blog posts
        for lang in config['languages']:
            urls.append(f"https://{domain}{config['path']}/{lang}/blog/")
    
    return urls


if __name__ == "__main__":
    print("Ecosystem Configuration")
    print(f"Domain: {ECOSYSTEM['domain']}")
    print(f"Languages: {ECOSYSTEM['languages']}")
    print()
    
    print("Active Projects:")
    for pid, config in get_active_projects().items():
        print(f"  {config['name']}: {config['concept']}")
        print(f"    Path: {config['path']}")
        print(f"    Languages: {config['languages']}")
        print(f"    Status: {config['status']}")
        print()
    
    print(f"All Languages: {get_all_languages()}")
    print(f"Sitemap URLs: {len(get_ecosystem_sitemap_urls())} total")
