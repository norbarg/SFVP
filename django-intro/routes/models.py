from django.db import models


class Country(models.Model):
    name = models.CharField(
        max_length=100,
        unique=True,
    )

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Route(models.Model):
    DIFFICULTY_CHOICES = [
        ("Easy", "Easy"),
        ("Medium", "Medium"),
        ("Hard", "Hard"),
    ]

    name = models.CharField(
        max_length=150,
    )

    duration = models.PositiveIntegerField()

    difficulty = models.CharField(
        max_length=20,
        choices=DIFFICULTY_CHOICES,
    )

    country = models.ForeignKey(
        Country,
        on_delete=models.PROTECT,
        related_name="routes",
    )

    class Meta:
        ordering = ["duration", "name"]

    def __str__(self):
        return self.name
