# calendar-availability-vue
Weekly calendar availability component for Nextcloud apps

## Slots data structure

The following data structure is used in the front-end. There are helpers to converts from the ical `VAVAILABILITY` structure to this custom structure and back.

### Empty slots

If no slots are set yet, each day **must** have an empty array.

```json
{
    "timezoneId": "Europe/Berlin",
    "slots": {
        "MO": [],
        "TU": [],
        "WE": [],
        "TH": [],
        "FR": [],
        "SA": [],
        "SU": [],
    }
}
```

### Real world example

The following example shows a Mo-Fr schedule.

```json
{
    "timezoneId": "Europe/Berlin",
    "slots":{
        "MO": [
            {
                "start": 1637568000,
                "end": 1637578800,
            },
            {
                "start": 1637582400,
                "end": 1637596800,
            }
        ],
        "TU": [
            {
                "start": 1637568000,
                "end": 1637578800,
            },
            {
                "start": 1637582400,
                "end": 1637596800,
            }
        ],
        "WE": [
            {
                "start": 1637568000,
                "end": 1637578800,
            },
            {
                "start": 1637582400,
                "end": 1637596800,
            }
        ],
        "TH": [
            {
                "start": 1637568000,
                "end": 1637578800,
            },
            {
                "start": 1637582400,
                "end": 1637596800,
            }
        ],
        "FR": [
                        {
                "start": 1637568000,
                "end": 1637578800,
            },
            {
                "start": 1637582400,
                "end": 1637589600,
            }
        ],
        "SA": [],
        "SU": [],
    }
}
```
