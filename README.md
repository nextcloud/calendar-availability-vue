# calendar-availability-vue
Weekly calendar availability component for Nextcloud apps

## Slots data structure

The following data structure is used in the front-end. There are helpers to converts from the ical `VAVAILABILITY` structure to this custom structure and back.

### Empty slots

If now slots are set yet, each day **must** have an empty array.

```json
{
    "MO": [],
    "TU": [],
    "WE": [],
    "TH": [],
    "FR": [],
    "SA": [],
    "SU": [],
}
```

### Real world example

The following example shows a Mo-Fr 9-5 schedule.

```json
{
    "MO": [
        "start": 1637568000,
        "end": 1637596800,
    ],
    "TU": [
        "start": 1637568000,
        "end": 1637596800,
    ],
    "WE": [
        "start": 1637568000,
        "end": 1637596800,
    ],
    "TH": [
        "start": 1637568000,
        "end": 1637596800,
    ],
    "FR": [
        "start": 1637568000,
        "end": 1637596800,
    ],
    "SA": [],
    "SU": [],
}
```
