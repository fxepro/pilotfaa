from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework import status

from .models import SiteConfig
from .serializers import SiteConfigSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_site_config(request):
    """Get site configuration (Authenticated users)"""
    config = SiteConfig.get_config()
    serializer = SiteConfigSerializer(config)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_public_site_flags(request):
    """Public endpoint for client runtime flags (no secrets)"""
    config = SiteConfig.get_config()
    return Response({
        'enable_analytics': getattr(config, 'enable_analytics', False),
    })


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAdminUser])
def update_site_config(request):
    """Update site configuration (Admin only)"""
    import logging
    logger = logging.getLogger(__name__)

    config = SiteConfig.get_config()

    logger.info(f"Updating site config. Received data: {request.data}")
    logger.info(f"Current enable_email_verification: {config.enable_email_verification}")

    serializer = SiteConfigSerializer(
        config,
        data=request.data,
        partial=(request.method == 'PATCH')
    )

    if serializer.is_valid():
        logger.info(f"Serializer valid. Saving with data: {serializer.validated_data}")
        serializer.save(updated_by=request.user)

        config.refresh_from_db()
        logger.info(f"After save - enable_email_verification: {config.enable_email_verification}")

        return Response(serializer.data)

    logger.error(f"Serializer validation failed: {serializer.errors}")
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
