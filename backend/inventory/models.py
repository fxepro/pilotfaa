import uuid
from django.db import models


SCHEMA = "inventory"


def schema_table(table):
    return f'{SCHEMA}"."{table}'


class InventoryLocation(models.Model):
    LOCATION_TYPES = (
        ("warehouse", "Warehouse"),
        ("store", "Store"),
        ("virtual", "Virtual"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    store_id = models.UUIDField(null=True, blank=True)
    name = models.CharField(max_length=200)
    location_type = models.CharField(max_length=50, choices=LOCATION_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = schema_table("inventory_locations")

    def __str__(self):
        return self.name


class InventoryLevel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    variant_id = models.UUIDField()
    location = models.ForeignKey(InventoryLocation, on_delete=models.CASCADE)
    quantity_on_hand = models.IntegerField(default=0)
    quantity_reserved = models.IntegerField(default=0)
    low_stock_threshold = models.IntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = schema_table("inventory_levels")
        unique_together = ("variant_id", "location")
        indexes = [
            models.Index(fields=["variant_id"]),
            models.Index(fields=["location"]),
        ]


class InventoryMovement(models.Model):
    MOVEMENT_TYPES = (
        ("sale", "Sale"),
        ("refund", "Refund"),
        ("adjustment", "Adjustment"),
        ("restock", "Restock"),
        ("reservation", "Reservation"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    variant_id = models.UUIDField()
    location = models.ForeignKey(InventoryLocation, on_delete=models.CASCADE)
    movement_type = models.CharField(max_length=50, choices=MOVEMENT_TYPES)
    quantity_delta = models.IntegerField()
    reference_type = models.CharField(max_length=50, blank=True)
    reference_id = models.UUIDField(null=True, blank=True)
    created_by = models.UUIDField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = schema_table("inventory_movements")
        indexes = [
            models.Index(fields=["variant_id"]),
            models.Index(fields=["movement_type"]),
        ]
