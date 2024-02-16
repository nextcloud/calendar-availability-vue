<template>
	<ul class="week-day-container" aria-label="List of weekdays">
		<template v-for="day in internalSlots">
			<li :key="`day-label-${day.id}`" class="day-container">
				<div class="label-weekday">
					<span :id="day.displayName + '-label'">{{ day.displayName }}</span>
				</div>
				<div :key="`day-slots-${day.id}`" class="availability-slots">
					<div class="availability-slot-group">
						<template v-for="(slot, idx) in day.slots">
							<div :key="`slot-${day.id}-${idx}`" class="availability-slot">
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
									type="tertiary"
									class="button"
									:aria-label="l10nDeleteSlot"
									:title="l10nDeleteSlot"
									@click="removeSlot(day, idx)">
									<template #icon>
										<IconDelete :size="20" />
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
import NcDateTimePickerNative from '@nextcloud/vue/dist/Components/NcDateTimePickerNative.js'
import NcButton from '@nextcloud/vue/dist/Components/NcButton.js'
import IconDelete from 'vue-material-design-icons/Delete.vue'
import IconAdd from 'vue-material-design-icons/Plus.vue'

import { getFirstDay } from '@nextcloud/l10n'

export default {
	name: 'CalendarAvailability',
	components: {
		NcDateTimePickerNative,
		NcButton,
		IconAdd,
		IconDelete,
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
.availability-day {
	padding: 0 10px 0 10px;
	position: absolute;
}
.availability-slots {
	max-width: 332px;
	width: 100%;
	display: flex;
	justify-content: flex-start;
	white-space: nowrap;
}
.availability-slot {
	display: flex;
	flex-direction: row;
	align-items: center;
}
.availability-slot-group {
	display: flex;
	flex-direction: column;
}
.time-zone {
	padding: 32px 12px 12px 0;
}
.week-day-container {
	box-sizing: border-box;
	margin-bottom: 32px;
	max-width: 500px;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 6px;
}
.button {
	align-self: flex-end;
}
.label-weekday {
	position: relative;
	display: flex;
	align-items: flex-start;
	min-width: 77px;
	width: 77px;

	> span {
		height: 50px;
		display: flex;
		align-items: center;
	}
}
.add-another {
	background-color: transparent;
	border: none;
	opacity: .5;
	display: inline-flex;
	padding: 0;
	margin: 0;
	margin-bottom: 3px;

	&:hover {
		opacity: 1;
	}
}
.to-text {
	padding-right: 12px;
}
.time-zone-text{
	padding-left: 22px;
}
.empty-content {
	color: var(--color-text-lighter);
	display: inline-flex;
	align-items: center;
}
.start-date {
	padding-right: 12px;
}
.day-container {
	display: flex;
	max-width: 500px;
	width: 100%;
	gap: 24px;
}
</style>
