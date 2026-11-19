from django import forms

from .models import Country, Route


class CountryForm(forms.ModelForm):
    class Meta:
        model = Country
        fields = ["name"]

        widgets = {
            "name": forms.TextInput(
                attrs={
                    "placeholder": "Country name",
                }
            ),
        }
 

class RouteForm(forms.ModelForm):
    class Meta:
        model = Route
        fields = [
            "name",
            "country",
            "duration",
            "difficulty",
        ]

        widgets = {
            "name": forms.TextInput(
                attrs={
                    "placeholder": "Route name",
                }
            ),
            "duration": forms.NumberInput(
                attrs={
                    "min": 1,
                }
            ),
        }
