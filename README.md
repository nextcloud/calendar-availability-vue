<!--
  - SPDX-FileCopyrightText: 2021 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: MIT
-->
# calendar-availability-vue

[![REUSE status](https://api.reuse.software/badge/github.com/nextcloud/calendar-availability-vue)](https://api.reuse.software/info/github.com/nextcloud/calendar-availability-vue)

Weekly calendar availability component for Nextcloud apps

## Maintainers

* [ChristophWurst](https://github.com/ChristophWurst)
* [st3iny](https://github.com/st3iny)

## Compatibility matrix

`@nextcloud/calendar-availability-vue` | `@nextcloud/vue`
---------------------------------------|-----------------
1.x.x                                  | 6.x.x. and 7.x.x
2.x.x                                  | 8.x.x

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

## Development setup

If you want to work on improving the components it’s best to run the latest code and link it to your local Nextcloud installation:

1. Install the dependencies with `npm ci`
2. Build the components every time you do changes: `npm run build`
3. Connect it to your local Nextcloud development setup:
    - In this repository do `npm link`
    - In the repository of an app do `npm link @nextcloud/calendar-availability-vue` (you need to re-link any time you do `npm ci` in the app)
4. Then build the app with: `npm run build` (or watch for changes with `npm run watch`)

