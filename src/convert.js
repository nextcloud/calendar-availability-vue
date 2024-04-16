import { getZoneString } from 'icalzone'
import ICAL from 'ical.js'
import { v4 as uuidv4 } from 'uuid'
import logger from './utils/logger.js'

/**
 *
 */
export function getEmptySlots() {
	return {
		MO: [],
		TU: [],
		WE: [],
		TH: [],
		FR: [],
		SA: [],
		SU: [],
	}
}

/**
 *
 * @param vavailability
 */
export function vavailabilityToSlots(vavailability) {
	const parsedIcal = ICAL.parse(vavailability)

	const vcalendarComp = new ICAL.Component(parsedIcal)
	const vavailabilityComp = vcalendarComp.getFirstSubcomponent('vavailability')

	let timezoneId
	const timezoneComp = vcalendarComp.getFirstSubcomponent('vtimezone')
	if (timezoneComp) {
		timezoneId = timezoneComp.getFirstProperty('tzid').getFirstValue()
	}

	const availableComps = vavailabilityComp.getAllSubcomponents('available')
	// Combine all AVAILABLE blocks into a week of slots
	const slots = getEmptySlots()
	availableComps.forEach((availableComp) => {
		const start = availableComp.getFirstProperty('dtstart').getFirstValue().toJSDate()
		const end = availableComp.getFirstProperty('dtend').getFirstValue().toJSDate()
		const rrule = availableComp.getFirstProperty('rrule')

		if (rrule.getFirstValue().freq !== 'WEEKLY') {
			logger.warn('rrule not supported', {
				rrule: rrule.toICALString(),
			})
			return
		}

		rrule.getFirstValue().getComponent('BYDAY').forEach(day => {
			slots[day].push({
				start: start.getTime() / 1000,
				end: end.getTime() / 1000,
			})
		})
	})

	return {
		slots,
		timezoneId,
	}
}

/**
 *
 * @param slots
 * @param timezoneId
 */
export function slotsToVavailability(slots, timezoneId) {
	const vcalendarComp = new ICAL.Component('vcalendar')
	vcalendarComp.addPropertyWithValue('prodid', 'Nextcloud DAV app')

	// Store time zone info
	// If possible we use the info from a time zone database
	const predefinedTimezoneIcal = getZoneString(timezoneId)
	if (predefinedTimezoneIcal) {
		const timezoneComp = new ICAL.Component(ICAL.parse(predefinedTimezoneIcal))
		vcalendarComp.addSubcomponent(timezoneComp)
	} else {
		// Fall back to a simple markup
		const timezoneComp = new ICAL.Component('vtimezone')
		timezoneComp.addPropertyWithValue('tzid', timezoneId)
		vcalendarComp.addSubcomponent(timezoneComp)
	}

	// Store availability info
	const vavailabilityComp = new ICAL.Component('vavailability')

	// Deduplicate by start and end time
	const deduplicated = slots.reduce((acc, slot) => {
		const start = new Date(slot.start * 1000)
		const end = new Date(slot.end * 1000)

		const key = [
			start.getHours(),
			start.getMinutes(),
			end.getHours(),
			end.getMinutes(),
		].join('-')

		return {
			...acc,
			[key]: [...(acc[key] ?? []), slot],
		}
	}, {})

	// Create an AVAILABILITY component for every recurring slot
	Object.keys(deduplicated).map(key => {
		const slots = deduplicated[key]
		const start = slots[0].start
		const end = slots[0].end
		// Combine days but make them also unique
		const days = slots.map(slot => slot.day).filter((day, index, self) => self.indexOf(day) === index)

		const availableComp = new ICAL.Component('available')

		// Define DTSTART and DTEND
		const startTimeProp = availableComp.addPropertyWithValue('dtstart', ICAL.Time.fromJSDate(new Date(start * 1000), false))
		startTimeProp.setParameter('tzid', timezoneId)
		const endTimeProp = availableComp.addPropertyWithValue('dtend', ICAL.Time.fromJSDate(new Date(end * 1000), false))
		endTimeProp.setParameter('tzid', timezoneId)

		// Add mandatory UID
		availableComp.addPropertyWithValue('uid', uuidv4())

		// TODO: add optional summary

		// Define RRULE
		availableComp.addPropertyWithValue('rrule', {
			freq: 'WEEKLY',
			byday: days,
		})

		return availableComp
	}).map(vavailabilityComp.addSubcomponent.bind(vavailabilityComp))

	vcalendarComp.addSubcomponent(vavailabilityComp)

	return vcalendarComp.toString()
}
