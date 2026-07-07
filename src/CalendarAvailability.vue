<!--
  - SPDX-FileCopyrightText: 2021 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: MIT
-->
<template>
	<ul class="week-day-container" :aria-label="l10nWeekDayListLabel">
		<template v-for="day in internalSlots" :key="`day-label-${day.id}`">
			<li class="day-container">
				<div class="label-weekday">
					<span :id="day.displayName + '-label'">{{ day.displayName }}</span>
				</div>
				<div :key="`day-slots-${day.id}`" class="availability-slots">
					<div class="availability-slot-group">
						<template v-for="(slot, idx) in day.slots" :key="`slot-${day.id}-${idx}`">
							<div class="availability-slot">
								<NcDateTimePickerNative :id="`start-${day.id}-${idx}`"
									v-model="slot.start"
									type="time"
									:label="l10nStartPickerLabel?.(day.displayName)"
									:hide-label="true"
									class="start-date"
									@change="onChangeSlots" />
								<span class="to-text">
									{{ l10nTo }}
								</span>
								<NcDateTimePickerNative :id="`end-${day.id}-${idx}`"
									v-model="slot.end"
									type="time"
									:label="l10nEndPickerLabel?.(day.displayName)"
									:hide-label="true"
									class="end-date"
									@change="onChangeSlots" />
								<NcButton :key="`slot-${day.id}-${idx}-btn`"
									variant="tertiary"
									class="delete"
									:aria-label="l10nDeleteSlot"
									:title="l10nDeleteSlot"
									@click="removeSlot(day, idx)">
									<template #icon>
										<IconClose :size="20" />
									</template>
								</NcButton>
							</div>
						</template>
					</div>
					<span v-if="day.slots.length === 0"
						class="empty-content">
						{{ l10nEmptyDay }}
					</span>
				</div>
				<NcButton :key="`add-slot-${day.id}`"
					variant="tertiary"
					:disabled="loading"
					class="add-another button"
					:title="l10nAddSlot"
					:aria-label="l10nAddSlot"
					@click="addSlot(day)">
					<template #icon>
						<IconAdd :size="20" />
					</template>
				</NcButton>
			</li>
		</template>
	</ul>
</template>

<script>
import NcButton from '@nextcloud/vue/components/NcButton'
import NcDateTimePickerNative from '@nextcloud/vue/components/NcDateTimePickerNative'
import IconAdd from 'vue-material-design-icons/Plus.vue'
import IconClose from 'vue-material-design-icons/Close.vue'

import { getFirstDay } from '@nextcloud/l10n'

export default {
	name: 'CalendarAvailability',
	components: {
		NcDateTimePickerNative,
		NcButton,
		IconAdd,
		IconClose,
	},
	props: {
		slots: {
			type: Object,
			required: true,
		},
		loading: {
			type: Boolean,
			default: false,
		},
		l10nTo: {
			type: String,
			required: true,
		},
		l10nDeleteSlot: {
			type: String,
			required: true,
		},
		l10nEmptyDay: {
			type: String,
			required: true,
		},
		l10nAddSlot: {
			type: String,
			required: true,
		},
		l10nWeekDayListLabel: {
			type: String,
			default: 'Weekdays',
		},
		l10nMonday: {
			type: String,
			required: true,
		},
		l10nTuesday: {
			type: String,
			required: true,
		},
		l10nWednesday: {
			type: String,
			required: true,
		},
		l10nThursday: {
			type: String,
			required: true,
		},
		l10nFriday: {
			type: String,
			required: true,
		},
		l10nSaturday: {
			type: String,
			required: true,
		},
		l10nSunday: {
			type: String,
			required: true,
		},
		l10nStartPickerLabel: {
			type: Function,
			default: (dayName) => `Pick a start time for ${dayName}`,
		},
		l10nEndPickerLabel: {
			type: Function,
			default: (dayName) => `Pick a end time for ${dayName}`,
		},
	},
	data() {
		return {
			internalSlots: this.slotsToInternalData(this.slots),
		}
	},
	watch: {
		slots() {
			this.internalSlots = this.slotsToInternalData(this.slots)
		},
	},
	methods: {
		timeStampSlotsToDateObjectSlots(slots) {
			return slots.map(slot => ({
				start: new Date(slot.start * 1000),
				end: new Date(slot.end * 1000),
			}))
		},
		slotsToInternalData() {
			const moToSa = [
				{
					id: 'MO',
					displayName: this.l10nMonday,
					slots: this.timeStampSlotsToDateObjectSlots(this.slots.MO),
				},
				{
					id: 'TU',
					displayName: this.l10nTuesday,
					slots: this.timeStampSlotsToDateObjectSlots(this.slots.TU),
				},
				{
					id: 'WE',
					displayName: this.l10nWednesday,
					slots: this.timeStampSlotsToDateObjectSlots(this.slots.WE),
				},
				{
					id: 'TH',
					displayName: this.l10nThursday,
					slots: this.timeStampSlotsToDateObjectSlots(this.slots.TH),
				},
				{
					id: 'FR',
					displayName: this.l10nFriday,
					slots: this.timeStampSlotsToDateObjectSlots(this.slots.FR),
				},
				{
					id: 'SA',
					displayName: this.l10nSaturday,
					slots: this.timeStampSlotsToDateObjectSlots(this.slots.SA),
				},
			]
			const sunday = {
				id: 'SU',
				displayName: this.l10nSunday,
				slots: this.timeStampSlotsToDateObjectSlots(this.slots.SU),
			}

			return getFirstDay() === 1 ? [...moToSa, sunday] : [sunday, ...moToSa]
		},
		internalDataToSlots() {
			const converted = {}
			this.internalSlots.forEach(({ id, slots }) => {
				converted[id] = slots.map(slot => ({
					start: Math.round(slot.start.getTime() / 1000),
					end: Math.round(slot.end.getTime() / 1000),
				}))
			})
			return converted
		},
		addSlot(day) {
			const start = new Date()
			start.setHours(9, 0, 0, 0)
			const end = new Date()
			end.setHours(17, 0, 0, 0)

			day.slots.push({
				start,
				end,
			})

			this.onChangeSlots()
		},
		removeSlot(day, idx) {
			day.slots.splice(idx, 1)

			this.onChangeSlots()
		},
		onChangeSlots() {
			this.$emit('update:slots', this.internalDataToSlots())
		},
	},
}
</script>

<style lang="scss" scoped>
.week-day-container {
	box-sizing: border-box;
	margin-bottom: calc(var(--default-grid-baseline) * 8);
	max-width: 700px;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
}

.day-container {
	display: flex;
	width: 100%;
	gap: calc(var(--default-grid-baseline) * 8);
	padding: calc(var(--default-grid-baseline) * 2) 0;
	border-bottom: 1px solid var(--color-border);
	align-items: center;

	& > button {
		align-self: center;
	}
}

.label-weekday {
	position: relative;
	display: flex;
	align-items: flex-start;
	min-width: calc(var(--default-grid-baseline) * 20);
	width: calc(var(--default-grid-baseline) * 20);
	margin-bottom: auto;

	> span {
		display: flex;
		align-items: center;
		height: var(--default-clickable-area);

	}
}

.availability-slots {
	width: 100%;
	display: flex;
	justify-content: flex-start;
	white-space: nowrap;
}

.availability-slot-group {
	display: flex;
	flex-direction: column;
	gap: calc(var(--default-grid-baseline) * 2);
}

.availability-slot {
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: calc(var(--default-grid-baseline) * 3);
}

.delete {
	align-self: flex-end;
}

.add-another {
	margin-top: auto;
}

.empty-content {
	color: var(--color-text-maxcontrast);
	display: inline-flex;
	align-items: center;
	margin-inline-start: calc(var(--default-grid-baseline) * 3);
}

.time-zone {
	padding: 32px 12px 12px 0;
}

.time-zone-text{
	padding-left: calc(var(--default-grid-baseline) * 6);
}

</style>
