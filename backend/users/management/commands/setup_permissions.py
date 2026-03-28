"""
Management command to seed FeaturePermissions and assign them to roles.

Usage:
    python manage.py setup_permissions
"""

from django.core.management.base import BaseCommand
from django.contrib.auth.models import Permission, Group, ContentType
from django.contrib.contenttypes.models import ContentType
from users.permission_models import FeaturePermission


class Command(BaseCommand):
    help = 'Seed FeaturePermissions and assign them to roles'

    def handle(self, *args, **options):
        self.stdout.write('Setting up permissions...')
        
        # Define all permissions with their details
        PERMISSIONS = [
            # Workspace
            {'code': 'dashboard.view', 'name': 'View Dashboard', 'category': 'workspace', 'description': 'View workspace overview'},
            {'code': 'dashboard.edit', 'name': 'Edit Dashboard', 'category': 'workspace', 'description': 'Edit dashboard settings'},
            
            # User Features
            {'code': 'site_audit.view', 'name': 'View Site Audits', 'category': 'user_features', 'description': 'View site audit reports'},
            {'code': 'site_audit.create', 'name': 'Create Site Audits', 'category': 'user_features', 'description': 'Create new site audits'},
            {'code': 'site_audit.delete', 'name': 'Delete Site Audits', 'category': 'user_features', 'description': 'Delete site audit reports'},
            {'code': 'performance.view', 'name': 'View Performance', 'category': 'user_features', 'description': 'View performance analysis'},
            {'code': 'performance.create', 'name': 'Create Performance Analysis', 'category': 'user_features', 'description': 'Create performance analysis'},
            {'code': 'monitoring.view', 'name': 'View Monitoring', 'category': 'user_features', 'description': 'View user monitoring (own sites)'},
            {'code': 'monitoring.create', 'name': 'Create Monitoring', 'category': 'user_features', 'description': 'Create monitoring checks'},
            {'code': 'monitoring.edit', 'name': 'Edit Monitoring', 'category': 'user_features', 'description': 'Edit monitoring settings'},
            {'code': 'monitoring.delete', 'name': 'Delete Monitoring', 'category': 'user_features', 'description': 'Delete monitoring checks'},
            {'code': 'reports.view', 'name': 'View Reports', 'category': 'user_features', 'description': 'View reports'},
            {'code': 'reports.export', 'name': 'Export Reports', 'category': 'user_features', 'description': 'Export reports'},
            {'code': 'ai_health.view', 'name': 'View AI Health', 'category': 'user_features', 'description': 'View AI health monitoring'},
            {'code': 'google_analytics.view', 'name': 'View Google Analytics', 'category': 'user_features', 'description': 'View Google Analytics data'},
            {'code': 'wordpress.view', 'name': 'View WordPress', 'category': 'user_features', 'description': 'View WordPress integration'},
            {'code': 'api_monitoring_user.view', 'name': 'View API Monitoring (User)', 'category': 'user_features', 'description': 'View API monitoring for user features'},
            
            # Account
            {'code': 'profile.view', 'name': 'View Profile', 'category': 'account', 'description': 'View user profile'},
            {'code': 'profile.edit', 'name': 'Edit Profile', 'category': 'account', 'description': 'Edit own profile'},
            
            # Admin Features
            {'code': 'users.view', 'name': 'View Users', 'category': 'admin_features', 'description': 'View user management'},
            {'code': 'users.create', 'name': 'Create Users', 'category': 'admin_features', 'description': 'Create new users'},
            {'code': 'users.edit', 'name': 'Edit Users', 'category': 'admin_features', 'description': 'Edit user accounts'},
            {'code': 'users.delete', 'name': 'Delete Users', 'category': 'admin_features', 'description': 'Delete user accounts'},
            {'code': 'roles.view', 'name': 'View Roles', 'category': 'admin_features', 'description': 'View role management'},
            {'code': 'roles.create', 'name': 'Create Roles', 'category': 'admin_features', 'description': 'Create new roles'},
            {'code': 'roles.edit', 'name': 'Edit Roles', 'category': 'admin_features', 'description': 'Edit roles'},
            {'code': 'roles.delete', 'name': 'Delete Roles', 'category': 'admin_features', 'description': 'Delete roles'},
            {'code': 'analytics.view', 'name': 'View Analytics', 'category': 'admin_features', 'description': 'View system analytics'},
            {'code': 'system_monitoring.view', 'name': 'View System Monitoring', 'category': 'admin_features', 'description': 'View system health monitoring'},
            {'code': 'api_monitoring.view', 'name': 'View API Monitoring', 'category': 'admin_features', 'description': 'View API endpoint monitoring'},
            {'code': 'api_monitoring.edit', 'name': 'Edit API Monitoring', 'category': 'admin_features', 'description': 'Edit API monitoring settings'},
            {'code': 'seo_monitoring.view', 'name': 'View SEO Monitoring', 'category': 'admin_features', 'description': 'View SEO monitoring and rankings'},
            {'code': 'seo_monitoring.edit', 'name': 'Edit SEO Monitoring', 'category': 'admin_features', 'description': 'Edit SEO monitoring settings'},
            {'code': 'tools.view', 'name': 'View Tools', 'category': 'admin_features', 'description': 'View tools management'},
            {'code': 'tools.edit', 'name': 'Edit Tools', 'category': 'admin_features', 'description': 'Edit tool settings'},
            {'code': 'feedback.view', 'name': 'View Feedback', 'category': 'admin_features', 'description': 'View user feedback'},
            {'code': 'feedback.delete', 'name': 'Delete Feedback', 'category': 'admin_features', 'description': 'Delete feedback'},
            {'code': 'financials.view', 'name': 'View Financials', 'category': 'admin_features', 'description': 'View financial management'},
            {'code': 'financials.edit', 'name': 'Edit Financials', 'category': 'admin_features', 'description': 'Edit financial settings'},
            {'code': 'products.view', 'name': 'View Products', 'category': 'admin_features', 'description': 'View product catalog management'},
            {'code': 'products.edit', 'name': 'Edit Products', 'category': 'admin_features', 'description': 'Create and edit products'},
            {'code': 'inventory.view', 'name': 'View Inventory', 'category': 'admin_features', 'description': 'View inventory levels and movements'},
            {'code': 'inventory.edit', 'name': 'Edit Inventory', 'category': 'admin_features', 'description': 'Adjust inventory and stock settings'},
            {'code': 'pricing.view', 'name': 'View Pricing', 'category': 'admin_features', 'description': 'View price books and pricing rules'},
            {'code': 'pricing.edit', 'name': 'Edit Pricing', 'category': 'admin_features', 'description': 'Manage price books and pricing rules'},
            {'code': 'purchasing.view', 'name': 'View Purchasing', 'category': 'admin_features', 'description': 'View suppliers and purchase orders'},
            {'code': 'purchasing.edit', 'name': 'Edit Purchasing', 'category': 'admin_features', 'description': 'Create and manage purchase orders'},
            {'code': 'invoicing.view', 'name': 'View Invoicing', 'category': 'admin_features', 'description': 'View invoices and payments'},
            {'code': 'invoicing.edit', 'name': 'Edit Invoicing', 'category': 'admin_features', 'description': 'Create and manage invoices'},
            {'code': 'settings.view', 'name': 'View Settings', 'category': 'admin_features', 'description': 'View system settings'},
            {'code': 'settings.edit', 'name': 'Edit Settings', 'category': 'admin_features', 'description': 'Edit system settings'},
            {'code': 'blog.view', 'name': 'View Blog', 'category': 'admin_features', 'description': 'View blog posts'},
            {'code': 'blog.create', 'name': 'Create Blog Posts', 'category': 'admin_features', 'description': 'Create new blog posts'},
            {'code': 'blog.edit', 'name': 'Edit Blog Posts', 'category': 'admin_features', 'description': 'Edit blog posts'},
            {'code': 'blog.delete', 'name': 'Delete Blog Posts', 'category': 'admin_features', 'description': 'Delete blog posts'},
        ]
        
        # Create FeaturePermission records
        created_count = 0
        updated_count = 0
        
        for perm_data in PERMISSIONS:
            perm, created = FeaturePermission.objects.get_or_create(
                code=perm_data['code'],
                defaults={
                    'name': perm_data['name'],
                    'description': perm_data['description'],
                    'category': perm_data['category'],
                }
            )
            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f'Created permission: {perm.code}'))
            else:
                # Update if exists
                perm.name = perm_data['name']
                perm.description = perm_data['description']
                perm.category = perm_data['category']
                perm.save()
                updated_count += 1
                self.stdout.write(f'Updated permission: {perm.code}')
        
        self.stdout.write(self.style.SUCCESS(f'\nCreated {created_count} permissions, updated {updated_count} permissions'))
        
        # Create Django Permissions for ALL FeaturePermissions (not just those assigned to roles)
        # This ensures all permissions are available in the role management page
        self.stdout.write('\nCreating Django Permissions for all FeaturePermissions...')
        content_type, _ = ContentType.objects.get_or_create(
            app_label='users',
            model='featurepermission'
        )
        
        django_perm_count = 0
        for perm_data in PERMISSIONS:
            try:
                feature_perm = FeaturePermission.objects.get(code=perm_data['code'])
                codename = perm_data['code'].replace('.', '_')
                perm_name = perm_data['code'].replace('.', ' ').title()
                
                django_perm, created = Permission.objects.get_or_create(
                    codename=codename,
                    content_type=content_type,
                    defaults={'name': perm_name}
                )
                
                # Link FeaturePermission to Django Permission
                if not feature_perm.django_permission:
                    feature_perm.django_permission = django_perm
                    feature_perm.save()
                    django_perm_count += 1
            except FeaturePermission.DoesNotExist:
                self.stdout.write(self.style.WARNING(f'  FeaturePermission {perm_data["code"]} does not exist'))
        
        self.stdout.write(self.style.SUCCESS(f'Linked {django_perm_count} FeaturePermissions to Django Permissions'))
        
        # Assign permissions to roles
        self.stdout.write('\nAssigning permissions to roles...')
        
        # Define role permissions (based on the plan)
        # Note: Role names are capitalized in Group model
        ROLE_PERMISSIONS = {
            'Viewer': [
                'dashboard.view',  # Workspace Overview
                'site_audit.view',  # Site Audit
                'reports.view',  # Reports
                'profile.view',
                'profile.edit',
            ],
            'Analyst': [
                'dashboard.view',
                'site_audit.view',
                'site_audit.create',
                'performance.view',
                'performance.create',
                'monitoring.view',
                'monitoring.create',
                'reports.view',
                'reports.export',
                'profile.view',
                'profile.edit',
            ],
            'Manager': [
                'dashboard.view',
                'dashboard.edit',
                'site_audit.view',
                'site_audit.create',
                'site_audit.delete',
                'performance.view',
                'performance.create',
                'monitoring.view',
                'monitoring.create',
                'monitoring.edit',
                'monitoring.delete',
                'reports.view',
                'reports.export',
                'ai_health.view',
                'google_analytics.view',
                'api_monitoring_user.view',
                'profile.view',
                'profile.edit',
                'products.view',
                'inventory.view',
                'pricing.view',
                'purchasing.view',
                'invoicing.view',
            ],
            'Director': [
                'dashboard.view',
                'dashboard.edit',
                'site_audit.view',
                'site_audit.create',
                'site_audit.delete',
                'performance.view',
                'performance.create',
                'monitoring.view',
                'monitoring.create',
                'monitoring.edit',
                'monitoring.delete',
                'reports.view',
                'reports.export',
                'ai_health.view',
                'google_analytics.view',
                'api_monitoring_user.view',
                'profile.view',
                'profile.edit',
                'analytics.view',
                'financials.view',
                'users.view',
                'products.view',
                'inventory.view',
                'pricing.view',
                'purchasing.view',
                'invoicing.view',
            ],
            'Executive': [
                # Executive has all Director permissions plus additional admin capabilities
                'dashboard.view',
                'dashboard.edit',
                'site_audit.view',
                'site_audit.create',
                'site_audit.delete',
                'performance.view',
                'performance.create',
                'monitoring.view',
                'monitoring.create',
                'monitoring.edit',
                'monitoring.delete',
                'reports.view',
                'reports.export',
                'ai_health.view',
                'google_analytics.view',
                'api_monitoring_user.view',
                'profile.view',
                'profile.edit',
                'analytics.view',
                'financials.view',
                'financials.edit',
                'users.view',
                'users.create',
                'users.edit',
                'roles.view',
                'products.view',
                'products.edit',
                'inventory.view',
                'inventory.edit',
                'pricing.view',
                'pricing.edit',
                'purchasing.view',
                'purchasing.edit',
                'invoicing.view',
                'invoicing.edit',
            ],
            'Agency': [
                # Agency role for managing multiple clients - similar to Director with user management
                'dashboard.view',
                'dashboard.edit',
                'site_audit.view',
                'site_audit.create',
                'site_audit.delete',
                'performance.view',
                'performance.create',
                'monitoring.view',
                'monitoring.create',
                'monitoring.edit',
                'monitoring.delete',
                'reports.view',
                'reports.export',
                'ai_health.view',
                'google_analytics.view',
                'api_monitoring_user.view',
                'profile.view',
                'profile.edit',
                'analytics.view',
                'users.view',
                'users.create',
                'users.edit',
                'financials.view',
                'products.view',
                'inventory.view',
                'pricing.view',
                'purchasing.view',
                'invoicing.view',
            ],
            'Auditor': [
                # Auditor role - read-only access with reporting capabilities
                'dashboard.view',
                'site_audit.view',
                'performance.view',
                'monitoring.view',
                'reports.view',
                'reports.export',
                'ai_health.view',
                'google_analytics.view',
                'api_monitoring_user.view',
                'profile.view',
                'profile.edit',
                'analytics.view',
            ],
            'Admin': [
                # Admin gets all permissions - we'll add them all
            ]
        }
        
        # Get all permission codes for admin
        all_permission_codes = [p['code'] for p in PERMISSIONS]
        ROLE_PERMISSIONS['Admin'] = all_permission_codes
        
        # Content type already created above, reuse it
        # Assign permissions to groups
        for role_name, permission_codes in ROLE_PERMISSIONS.items():
            try:
                group = Group.objects.get(name=role_name)
                self.stdout.write(f'\nAssigning permissions to role: {role_name}')
                
                # Clear existing permissions first
                group.permissions.clear()
                
                assigned_count = 0
                
                for perm_code in permission_codes:
                    try:
                        # Get FeaturePermission to link
                        feature_perm = FeaturePermission.objects.get(code=perm_code)
                        
                        # Create Django permission if it doesn't exist
                        codename = perm_code.replace('.', '_')
                        perm_name = perm_code.replace('.', ' ').title()
                        
                        perm, created = Permission.objects.get_or_create(
                            codename=codename,
                            content_type=content_type,
                            defaults={'name': perm_name}
                        )
                        
                        # Link FeaturePermission to Django Permission
                        if not feature_perm.django_permission:
                            feature_perm.django_permission = perm
                            feature_perm.save()
                        
                        group.permissions.add(perm)
                        assigned_count += 1
                    except FeaturePermission.DoesNotExist:
                        self.stdout.write(self.style.WARNING(f'  FeaturePermission {perm_code} does not exist'))
                    except Exception as e:
                        self.stdout.write(self.style.WARNING(f'  Could not assign {perm_code}: {str(e)}'))
                
                self.stdout.write(self.style.SUCCESS(f'  Assigned {assigned_count} permissions to {role_name}'))
                
            except Group.DoesNotExist:
                self.stdout.write(self.style.WARNING(f'Role {role_name} does not exist. Run setup_roles first.'))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Error assigning permissions to {role_name}: {str(e)}'))
        
        self.stdout.write(self.style.SUCCESS('\nPermission setup complete!'))

