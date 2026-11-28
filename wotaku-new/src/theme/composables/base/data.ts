/**
 * All Rights Reserved
 *
 * Copyright (c) 2026 taskylizard
 *
 * All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */

import { useData as useData$ } from '@/theme/shared/client'
import type * as DefaultTheme from '@/shared/types/default-theme'

export const useData: typeof useData$<DefaultTheme.Config> = useData$
