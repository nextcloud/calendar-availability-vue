/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

module.exports = {
	globals: {
		ICAL: true,
	},
	extends: [
		'@nextcloud',
	],
	rules: {
		'no-console': 'off',
		'vue/no-v-for-template-key': 'off',
	},
}
