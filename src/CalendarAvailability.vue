<template>
	<div class="grid-table">
		<template v-for="day in daysOfTheWeek">
			<div :key="`day-label-${day.id}`" class="label-weekday">
				{{ day.displayName }}
			</div>
			<div :key="`day-slots-${day.id}`" class="availability-slots">
				<div class="availability-slot-group">
					<template v-for="(slot, idx) in day.slots">
						<div :key="`slot-${day.id}-${idx}`" class="availability-slot">
							<DatetimePicker
								v-model="slot.start"
								type="time"
								class="start-date"
								format="H:mm" />
							<span class="to-text">
								{{ l10nTo }}
							</span>
							<DatetimePicker
								v-model="slot.end"
								type="time"
								class="end-date"
								format="H:mm" />
							<button :key="`slot-${day.id}-${idx}-btn`"
								class="icon-delete delete-slot button"
								:title="l10nDeleteSlot"
								@click="$emit('deleteSlot', day, idx)" />
						</div>
					</template>
				</div>
				<span v-if="day.slots.length === 0"
					class="empty-content">
					{{ l10nEmptyDay }}
				</span>
			</div>
			<button :key="`add-slot-${day.id}`"
				:disabled="loading"
				class="icon-add add-another button"
				:title="l10nAddSlot"
				@click="$emit('addSlot', day)" />
		</template>
	</div>
</template>

<script>
import DatetimePicker from '@nextcloud/vue/dist/Components/DatetimePicker'
import { getFirstDay } from '@nextcloud/l10n'

export default {
	name: 'CalendarAvailability',
	components: {
		DatetimePicker,
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
	computed: {
		daysOfTheWeek() {
			const moToSa = [
				{
					id: 'MO',
					displayName: this.l10nMonday,
					slots: this.slots.MO,
				},
				{
					id: 'TU',
					displayName: this.l10nTuesday,
					slots: this.slots.TU,
				},
				{
					id: 'WE',
					displayName: this.l10nWednesday,
					slots: this.slots.WE,
				},
				{
					id: 'TH',
					displayName: this.l10nThursday,
					slots: this.slots.TH,
				},
				{
					id: 'FR',
					displayName: this.l10nFriday,
					slots: this.slots.FR,
				},
				{
					id: 'SA',
					displayName: this.l10nSaturday,
					slots: this.slots.SA,
				},
			]
			const sunday = {
				id: 'SU',
				displayName: this.l10nSunday,
				slots: this.slots.SU,
			}

			return getFirstDay() === 1 ? [...moToSa, sunday] : [sunday, ...moToSa]
		},
	},
}
</script>

<style lang="scss" scoped>
.availability-day {
	padding: 0 10px 10px 10px;
	position: absolute;
}
.availability-slots {
	display: flex;
	padding-left: 8px;
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
	padding: 12px 12px 12px 0;
}
.grid-table {
	display: grid;
	grid-column-gap: 20px;
	grid-row-gap: 20px;
	grid-template-columns: min-content min-content min-content;
}
.button {
	align-self: flex-end;
}
.label-weekday {
	position: relative;
	display: inline-flex;
	padding-top: 7px;
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
	align-self: center;
}

</style>
