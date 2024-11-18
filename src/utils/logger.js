/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import { getLoggerBuilder } from '@nextcloud/logger'

export default getLoggerBuilder()
	.detectUser()
	.setApp('@nextcloud/calendar-availability-vue')
	.build()
