"""
Permission API Views for RBAC

API endpoints for permission checking and navigation.
"""

import copy

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import Group
from .permission_utils import has_permission, get_user_permissions, filter_navigation_by_permissions
from .permission_classes import HasFeaturePermission
from .models import UserProfile


def _is_lms_only_student(user):
    """Profile role student, not staff/superuser — LMS only, no workspace."""
    if user.is_superuser or user.is_staff:
        return False
    try:
        return user.profile.role == 'student'
    except UserProfile.DoesNotExist:
        return False



# Workspace sidebar — single list for get_navigation + get_sidebar_matrix.
# Order: Home → Admin → Account → My Tools → Collateral → Integrations.
# Item "permission" values must match FeaturePermission codes (see setup_permissions).
WORKSPACE_NAV_SECTIONS = [
    {
        "id": "home",
        "title": "Home",
        "icon": "Home",
        "items": [
            {
                "id": "overview",
                "title": "Overview",
                "href": "/workspace",
                "icon": "LayoutDashboard",
                "permission": "dashboard.view",
            },
        ],
    },
    {
        "id": "admin_features",
        "title": "Admin",
        "icon": "Shield",
        "permission": "users.view",
        "items": [
            {
                "id": "admin_overview",
                "title": "Overview",
                "href": "/workspace/admin-overview",
                "icon": "LayoutDashboard",
                "permission": "dashboard.view",
            },
            {
                "id": "users",
                "title": "User Management",
                "href": "/workspace/users",
                "icon": "Users",
                "permission": "users.view",
            },
            {
                "id": "roles",
                "title": "Role Management",
                "href": "/workspace/roles",
                "icon": "Shield",
                "permission": "roles.view",
            },
            {
                "id": "analytics",
                "title": "Analytics",
                "href": "/workspace/analytics",
                "icon": "BarChart3",
                "permission": "analytics.view",
            },
            {
                "id": "api_monitoring",
                "title": "API Monitoring",
                "href": "/workspace/api-monitoring",
                "icon": "Network",
                "permission": "api_monitoring.view",
            },
            {
                "id": "seo_monitoring",
                "title": "SEO Monitoring",
                "href": "/workspace/seo-monitoring",
                "icon": "Search",
                "permission": "seo_monitoring.view",
            },
            {
                "id": "tools_management",
                "title": "Tools",
                "href": "/workspace/tools-management",
                "icon": "Wrench",
                "permission": "tools.view",
            },
            {
                "id": "ai_models",
                "title": "AI Models",
                "href": "/workspace/ai-models",
                "icon": "Cpu",
                "permission": "settings.view",
            },
            {
                "id": "databases",
                "title": "Databases",
                "href": "/workspace/databases",
                "icon": "Database",
                "permission": "settings.view",
            },
            {
                "id": "feedback",
                "title": "Feedback",
                "href": "/workspace/feedback",
                "icon": "MessageSquare",
                "permission": "feedback.view",
            },
            {
                "id": "financials",
                "title": "Financials",
                "href": "/workspace/financials",
                "icon": "DollarSign",
                "permission": "financials.view",
            },
            {
                "id": "products",
                "title": "Products",
                "href": "/workspace/products",
                "icon": "Package",
                "permission": "products.view",
            },
            {
                "id": "inventory",
                "title": "Inventory",
                "href": "/workspace/inventory",
                "icon": "Boxes",
                "permission": "inventory.view",
            },
            {
                "id": "pricing",
                "title": "Pricing",
                "href": "/workspace/pricing",
                "icon": "Tag",
                "permission": "pricing.view",
            },
            {
                "id": "purchasing",
                "title": "Purchasing",
                "href": "/workspace/purchasing",
                "icon": "ShoppingCart",
                "permission": "purchasing.view",
            },
            {
                "id": "invoicing",
                "title": "Invoicing",
                "href": "/workspace/invoicing",
                "icon": "FileText",
                "permission": "invoicing.view",
            },
            {
                "id": "admin_settings",
                "title": "System Settings",
                "href": "/workspace/system-settings",
                "icon": "Settings",
                "permission": "settings.view",
            },
        ],
    },
    {
        "id": "account",
        "title": "Account",
        "icon": "User",
        "items": [
            {
                "id": "profile",
                "title": "Profile",
                "href": "/workspace/profile?tab=profile",
                "icon": "User",
                "permission": "profile.view",
            },
            {
                "id": "account_people",
                "title": "People",
                "href": "/workspace/profile?tab=people",
                "icon": "Building2",
                "permission": "profile.view",
            },
            {
                "id": "account_financials",
                "title": "Financials",
                "href": "/workspace/profile?tab=financials",
                "icon": "CreditCard",
                "permission": "profile.view",
            },
            {
                "id": "account_subscriptions",
                "title": "Subscriptions",
                "href": "/workspace/profile?tab=subscriptions",
                "icon": "Repeat",
                "permission": "profile.view",
            },
            {
                "id": "account_billing_history",
                "title": "Billing History",
                "href": "/workspace/profile?tab=history",
                "icon": "Receipt",
                "permission": "profile.view",
            },
        ],
    },
    {
        "id": "user_features",
        "title": "My Tools",
        "icon": "Tool",
        "items": [
            {
                "id": "monitoring",
                "title": "Monitoring",
                "href": "/workspace/monitoring",
                "icon": "TrendingUp",
                "permission": "monitoring.view",
            },
            {
                "id": "ai_health",
                "title": "AI Health",
                "href": "/workspace/ai-health",
                "icon": "Activity",
                "permission": "ai_health.view",
            },
            {
                "id": "reports",
                "title": "Reports",
                "href": "/workspace/reports",
                "icon": "BarChart3",
                "permission": "reports.view",
            },
            {
                "id": "api_monitoring_user",
                "title": "API Monitoring",
                "href": "/workspace/api-monitoring-user",
                "icon": "Network",
                "permission": "api_monitoring_user.view",
            },
            {
                "id": "settings",
                "title": "Settings",
                "href": "/workspace/settings",
                "icon": "Settings",
                "permission": "profile.edit",
            },
        ],
    },
    {
        "id": "collateral",
        "title": "Collateral",
        "icon": "FolderOpen",
        "items": [
            {
                "id": "collateral_library",
                "title": "Library",
                "href": "/workspace/collateral",
                "icon": "Package",
                "permission": "dashboard.view",
            },
            {
                "id": "blogging",
                "title": "Blogging",
                "href": "/workspace/blogging",
                "icon": "BookOpen",
                "permission": "blog.view",
            },
        ],
    },
    {
        "id": "integrations",
        "title": "Integrations",
        "icon": "Plug",
        "items": [
            {
                "id": "google_analytics",
                "title": "Google Analytics",
                "href": "/workspace/google-analytics",
                "icon": "TrendingUp",
                "permission": "google_analytics.view",
            },
            {
                "id": "wordpress",
                "title": "WordPress",
                "href": "/workspace/wordpress",
                "icon": "Package",
                "permission": "wordpress.view",
            },
        ],
    },
]

# Role matrix UI only; not returned by get_navigation().
COMING_SOON_SECTION = {
                "id": "coming_soon",
                "title": "Coming Soon",
                "icon": "Clock",
                "permission": "users.view",
                "items": [
                    {
                        "id": "ai_analysis",
                        "title": "AI Analysis",
                        "href": "/workspace/ai-analysis",
                        "icon": "Cpu",
                        "permission": "users.view"
                    },
                    {
                        "id": "security_test",
                        "title": "Security Test",
                        "href": "/workspace/security",
                        "icon": "Shield",
                        "permission": "users.view"
                    },
                    {
                        "id": "apis",
                        "title": "APIs",
                        "href": "/workspace/apis",
                        "icon": "Network",
                        "permission": "users.view"
                    },
                    {
                        "id": "site_maintenance",
                        "title": "Site Maintenance",
                        "href": "/workspace/site-maintenance",
                        "icon": "Wrench",
                        "permission": "users.view"
                    },
                    {
                        "id": "saas_monitoring",
                        "title": "SAAS Monitoring",
                        "href": "/workspace/saas-monitoring",
                        "icon": "Plug",
                        "permission": "users.view"
                    },
                    {
                        "id": "ui_testing",
                        "title": "UI Testing",
                        "href": "/workspace/ui-testing",
                        "icon": "Monitor",
                        "permission": "users.view"
                    },
                    {
                        "id": "cloud_monitoring",
                        "title": "Cloud Monitoring",
                        "href": "/workspace/cloud-monitoring",
                        "icon": "Cloud",
                        "permission": "users.view"
                    }
                ]
            }

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_permissions(request):
    """
    Check if user has specific permissions.

    Query params:
        permissions: Comma-separated list of permission codes to check

    Returns:
        {
            "permissions": {
                # "site_audit.view": true,  # DEPRECATED
                "users.view": false
            }
        }
    """
    permission_codes = request.GET.get('permissions', '').split(',')
    permission_codes = [p.strip() for p in permission_codes if p.strip()]

    if not permission_codes:
        return Response(
            {'error': 'No permissions specified'},
            status=status.HTTP_400_BAD_REQUEST
        )

    results = {}
    for code in permission_codes:
        results[code] = has_permission(request.user, code)

    return Response({'permissions': results})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_permissions(request):
    """
    Get all permissions for the current user.

    Returns:
        {
            "permissions": ["performance.view", ...]  # site_audit.view DEPRECATED
        }
    """
    permissions = get_user_permissions(request.user)
    return Response({'permissions': permissions})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_navigation(request):
    """
    Get navigation structure filtered by user's permissions.

    Returns:
        Navigation structure with sections and items filtered by permissions
    """
    if _is_lms_only_student(request.user):
        return Response({
            "sections": [
                {
                    "id": "pilotfaa",
                    "title": "PilotFAA Ground School",
                    "icon": "Brain",
                    "items": [
                        {
                            "id": "lms_dashboard",
                            "title": "LMS Dashboard",
                            "href": "/lms",
                            "icon": "LayoutDashboard",
                        }
                    ],
                }
            ],
            "quickActions": [],
            "meta": {
                "nav_profile": "pilotfaa-admin-repo",
                "variant": "lms_student",
            },
        })

    # Get user permissions
    user_permissions_list = get_user_permissions(request.user)

    # Debug logging (remove in production)
    import logging
    logger = logging.getLogger(__name__)
    logger.debug(f"User: {request.user.username}, Permissions: {user_permissions_list}")

    navigation_structure = {
        "sections": list(WORKSPACE_NAV_SECTIONS),
        "quickActions": [
            # DEPRECATED: Site Audit removed
            # {
            #     "id": "new_audit",
            #     "title": "New Site Audit",
            #     "href": "/workspace/site-audit?new=true",
            #     "icon": "Plus",
            #     "permission": "site_audit.create"
            # }
        ]
    }

    # Superusers: do not filter by FeaturePermission rows. get_user_permissions() only lists
    # codes from the FeaturePermission table; if setup_permissions was never run, that list
    # is empty and every item with a permission would be stripped — leaving an empty sidebar.
    if request.user.is_superuser:
        filtered_navigation = copy.deepcopy(navigation_structure)
        django_section = {
            "id": "django_admin_shell",
            "title": "Django",
            "icon": "Server",
            "items": [
                {
                    "id": "django_admin",
                    "title": "Django Admin",
                    "href": "/django-admin/",
                    "icon": "Settings",
                },
            ],
        }
        filtered_navigation["sections"] = filtered_navigation["sections"] + [
            django_section
        ]
    else:
        filtered_navigation = filter_navigation_by_permissions(
            navigation_structure,
            user_permissions_list,
        )

    # Debug logging (remove in production)
    logger.debug(f"Filtered navigation sections: {len(filtered_navigation.get('sections', []))}")
    for section in filtered_navigation.get('sections', []):
        logger.debug(f"Section: {section.get('id')}, Items: {len(section.get('items', []))}")
        for item in section.get('items', []):
            logger.debug(f"  Item: {item.get('id')} ({item.get('title')}) - Permission: {item.get('permission')}")

    # If DevTools → /api/navigation/ JSON has no meta.nav_profile, you are not hitting this codebase's Django.
    filtered_navigation["meta"] = {
        "nav_profile": "pilotfaa-admin-repo",
        "variant": "workspace",
    }
    return Response(filtered_navigation)


@api_view(['GET'])
@permission_classes([IsAuthenticated, HasFeaturePermission('roles.view')])
def get_sidebar_matrix(request):
    """
    Get sidebar matrix showing View/Edit/Both access for all roles.

    Returns matrix data with permission breakdown per role per sidebar item.
    """
    from django.contrib.auth.models import Group
    from .permission_models import FeaturePermission

    # Get all roles (system + custom)
    # Define role order by seniority: Admin, Agency, Executive, Director, Manager, Analyst, Auditor, Viewer
    ROLE_ORDER = ['Admin', 'Agency', 'Executive', 'Director', 'Manager', 'Analyst', 'Auditor', 'Viewer']

    def role_sort_key(group):
        if group.name in ROLE_ORDER:
            return (0, ROLE_ORDER.index(group.name))
        return (1, group.name.lower())

    all_groups = sorted(Group.objects.all(), key=role_sort_key)

    navigation_structure = {
        "sections": list(WORKSPACE_NAV_SECTIONS) + [COMING_SOON_SECTION],
    }

    # System roles that cannot be modified
    # Ordered by seniority: Admin, Agency, Executive, Director, Manager, Analyst, Auditor, Viewer
    SYSTEM_ROLES = ['Admin', 'Agency', 'Executive', 'Director', 'Manager', 'Analyst', 'Auditor', 'Viewer']

    # Build roles list
    roles_data = []
    for group in all_groups:
        roles_data.append({
            "id": group.id,
            "name": group.name,
            "is_system_role": group.name in SYSTEM_ROLES
        })

    # Build sidebar items with role access
    sidebar_items = []

    for section in navigation_structure.get('sections', []):
        for item in section.get('items', []):
            # Get required permissions for this item
            item_permission = item.get('permission', '')

            # Determine what permissions this item needs (view, create, edit, delete)
            required_permissions = {}
            if item_permission:
                # Base permission (e.g., "site_audit.view")
                base_code = item_permission.rsplit('.', 1)[0] if '.' in item_permission else item_permission

                # Always include the item's own permission as 'view' if it's a view permission
                if '.view' in item_permission or item_permission.endswith('.view'):
                    required_permissions['view'] = item_permission

                # Check what permission types exist for this feature
                feature_perms = FeaturePermission.objects.filter(code__startswith=base_code + '.')
                for fp in feature_perms:
                    if '.view' in fp.code:
                        required_permissions['view'] = fp.code
                    elif '.create' in fp.code:
                        required_permissions['create'] = fp.code
                    elif '.edit' in fp.code:
                        required_permissions['edit'] = fp.code
                    elif '.delete' in fp.code:
                        required_permissions['delete'] = fp.code

                # If no feature perms found, use the base permission as view
                if not required_permissions:
                    required_permissions['view'] = item_permission

            # Get role access for this item
            role_access = {}
            for group in all_groups:
                # Get all permissions for this role
                role_perms = group.permissions.all()
                role_permission_codes = []

                # Special handling: Admin role should have all permissions
                # Check if this is the Admin group and if it doesn't have all permissions,
                # we'll add all FeaturePermission codes to ensure it shows all pages
                is_admin_group = group.name == 'Admin'

                for perm in role_perms:
                    try:
                        fp = FeaturePermission.objects.get(django_permission=perm)
                        role_permission_codes.append(fp.code)
                    except FeaturePermission.DoesNotExist:
                        # Fallback: try to find by matching codename pattern
                        # Django codename format: "seo_monitoring_view" -> "seo_monitoring.view"
                        codename = perm.codename
                        # Try to convert common patterns
                        if codename.endswith('_view'):
                            code = codename[:-5].replace('_', '.') + '.view'
                        elif codename.endswith('_create'):
                            code = codename[:-7].replace('_', '.') + '.create'
                        elif codename.endswith('_edit'):
                            code = codename[:-5].replace('_', '.') + '.edit'
                        elif codename.endswith('_delete'):
                            code = codename[:-7].replace('_', '.') + '.delete'
                        else:
                            code = codename.replace('_', '.')
                        role_permission_codes.append(code)

                # If Admin group, ensure it has all FeaturePermission codes for which Django permissions exist
                # This handles cases where Admin Group permissions might be incomplete
                # Admin role should have access to all features
                if is_admin_group:
                    all_feature_permissions = FeaturePermission.objects.filter(django_permission__isnull=False)
                    all_feature_permission_codes = list(all_feature_permissions.values_list('code', flat=True))
                    role_permission_codes = list(set(role_permission_codes + all_feature_permission_codes))

                # Check which permissions this role has for this item
                access = {
                    "view": False,
                    "create": False,
                    "edit": False,
                    "delete": False
                }

                for perm_type, perm_code in required_permissions.items():
                    if perm_code in role_permission_codes:
                        access[perm_type] = True

                # Generate display value
                display_parts = []
                if access['view']:
                    display_parts.append('V')
                if access['create']:
                    display_parts.append('C')
                if access['edit']:
                    display_parts.append('E')
                if access['delete']:
                    display_parts.append('D')

                display = '+'.join(display_parts) if display_parts else '-'

                role_access[str(group.id)] = {
                    **access,
                    "display": display
                }

            sidebar_items.append({
                "id": item.get('id'),
                "title": item.get('title'),
                "section": section.get('id'),
                "section_title": section.get('title'),
                "required_permissions": required_permissions,
                "href": item.get('href'),
                "role_access": role_access
            })

    # Calculate summary
    summary = {
        "total_items": len(sidebar_items),
        "role_counts": {}
    }

    for group in all_groups:
        accessible_count = 0
        for item in sidebar_items:
            access = item['role_access'].get(str(group.id), {})
            if access.get('display') != '-':
                accessible_count += 1

        summary["role_counts"][str(group.id)] = accessible_count

    return Response({
        "roles": roles_data,
        "sidebar_items": sidebar_items,
        "summary": summary
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated, HasFeaturePermission('roles.edit')])
def update_sidebar_matrix(request):
    """
    Update permissions for a role based on matrix changes.
    Expects: { role_id, permission_codes: [] }
    Allows updates for both system and custom roles (permissions can be changed, but system roles cannot be renamed/deleted).
    """
    from django.contrib.auth.models import Group, Permission
    from django.db import transaction
    from .permission_models import FeaturePermission
    import logging

    logger = logging.getLogger(__name__)

    role_id = request.data.get('role_id')
    permission_codes = request.data.get('permission_codes', [])

    logger.info(f"update_sidebar_matrix called: role_id={role_id}, permission_codes count={len(permission_codes)}")
    logger.info(f"Permission codes received: {permission_codes[:20]}")  # Log first 20

    if not role_id:
        return Response(
            {'error': 'role_id is required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        role = Group.objects.get(id=role_id)

        # Get current permissions before update
        existing_perms_before = set(role.permissions.all())
        logger.info(f"Role {role.name} ({role_id}) currently has {len(existing_perms_before)} permissions")

        # Get all FeaturePermissions for the provided codes
        feature_perms = FeaturePermission.objects.filter(code__in=permission_codes)
        found_codes = set(feature_perms.values_list('code', flat=True))
        missing_codes = set(permission_codes) - found_codes

        if missing_codes:
            logger.warning(f"Some permission codes not found in FeaturePermission: {missing_codes}")

        logger.info(f"Found {feature_perms.count()} FeaturePermissions for {len(permission_codes)} codes")

        # Get Django Permission objects linked to these FeaturePermissions
        django_perms = []
        from django.contrib.contenttypes.models import ContentType

        # Get content type for FeaturePermission
        content_type = ContentType.objects.get_for_model(FeaturePermission)

        for fp in feature_perms:
            if fp.django_permission:
                django_perms.append(fp.django_permission)
            else:
                # If no linked permission, try to find or create it
                codename = fp.code.replace('.', '_')
                perm, created = Permission.objects.get_or_create(
                    codename=codename,
                    content_type=content_type,
                    defaults={'name': fp.name}
                )
                if created:
                    logger.info(f"Created Django Permission: {codename}")
                fp.django_permission = perm
                fp.save()
                django_perms.append(perm)

        logger.info(f"Resolved {len(django_perms)} Django Permissions")

        # IMPORTANT: The frontend sends ALL permissions for the role
        # So we should just use what they send (they've already merged)
        # But keep non-FeaturePermission permissions as a safety measure

        # Get all existing permissions for this role
        existing_perms = list(role.permissions.all())
        codes_being_updated = set(permission_codes)

        # Separate existing permissions into FeaturePermissions and others
        existing_feature_perms = []
        other_perms = []

        for perm in existing_perms:
            try:
                fp = FeaturePermission.objects.get(django_permission=perm)
                # Only keep FeaturePermissions that aren't being updated
                # (the new ones will replace them)
                if fp.code not in codes_being_updated:
                    existing_feature_perms.append(perm)
            except FeaturePermission.DoesNotExist:
                # Keep non-FeaturePermission permissions (Django built-in perms, etc.)
                other_perms.append(perm)

        # Combine: new FeaturePermissions + existing FeaturePermissions not being updated + other permissions
        final_permissions = list(set(django_perms + existing_feature_perms + other_perms))

        logger.info(f"Final permission count: {len(final_permissions)} (new: {len(django_perms)}, kept existing: {len(existing_feature_perms)}, other: {len(other_perms)})")

        # Update role permissions
        with transaction.atomic():
            role.permissions.set(final_permissions)
            role.refresh_from_db()

        # Verify the save
        saved_perms = set(role.permissions.all())
        logger.info(f"After save: role {role.name} has {len(saved_perms)} permissions")

        # Return updated role data
        return Response({
            'message': 'Permissions updated successfully',
            'role_id': role.id,
            'role_name': role.name,
            'permission_count': len(django_perms),
            'total_permissions': len(final_permissions),
            'saved_permission_count': len(saved_perms)
        })

    except Group.DoesNotExist:
        return Response(
            {'error': f'Role with id {role_id} not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': f'Error updating role: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
