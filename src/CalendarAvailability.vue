<template>
	<div class="grid-table">
		<template v-for="day in internalSlots">
			<div :key="`day-label-${day.id}`" class="label-weekday">
				{{ day.displayName }}
			</div>
			<div :key="`day-slots-${day.id}`" class="availability-slots">
				<div class="availability-slot-group">
					<template v-for="(slot, idx) in day.slots">
						<div :key="`slot-${day.id}-${idx}`" class="availability-slot">
							<NcDatetimePicker v-model="slot.start"
								type="time"
								class="start-date"
								format="H:mm"
								@change="onChangeSlots" />
							<span class="to-text">
								{{ l10nTo }}
							</span>
							<NcDatetimePicker v-model="slot.end"
								type="time"
								class="end-date"
								format="H:mm"
								@change="onChangeSlots" />
							<Button :key="`slot-${day.id}-${idx}-btn`"
								class="delete-slot button"
								:title="l10nDeleteSlot"
								@click="removeSlot(day, idx)">
								<template #icon>
									<IconDelete :size="20" />
								</template>
							</Button>
						</div>
					</template>
				</div>
				<span v-if="day.slots.length === 0"
					class="empty-content">
					{{ l10nEmptyDay }}
				</span>
			</div>
			<Button :key="`add-slot-${day.id}`"
				:disabled="loading"
				class="add-another button"
				:title="l10nAddSlot"
				@click="addSlot(day)">
				<template #icon>
					<IconAdd :size="20" />
				</template>
			</Button>
		</template>
	</div>
</template>

<script>

import DatetimePicker from '@nextcloud/vue/dist/Components/NcDatetimePicker'
import Button from '@nextcloud/vue/dist/Components/NcButton'
import IconAdd from 'vue-material-design-icons/Plus'
import IconDelete from 'vue-material-design-icons/Delete'
import { getFirstDay } from '@nextcloud/l10n'

export default {
	name: 'CalendarAvailability',
	components: {
		DatetimePicker,
		Button,
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
	display: flex;
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
::v-deep .mx-input-wrapper {
	width: 85px;
}
::v-deep .mx-datepicker {
	width: 97px;
}
::v-deep .multiselect {
	border: 1px solid var(--color-border-dark);
	width: 120px;
}
.time-zone {
	padding: 32px 12px 12px 0;
}
.grid-table {
	display: grid;
	margin-bottom: 32px;
	grid-column-gap: 24px;
	grid-row-gap: 6px;
	grid-template-columns: min-content min-content min-content;
}
.button {
	align-self: flex-end;
}
.label-weekday {
	position: relative;
	display: inline-flex;
	padding-top: 4px;
}
.delete-slot {
	background-color: transparent;
	border: none;
	padding-bottom: 12px;
	opacity: .5;
	&:hover {
		opacity: 1;
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
	margin-top: 4px;
}

</style>
