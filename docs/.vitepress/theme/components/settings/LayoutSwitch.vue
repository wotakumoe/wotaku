<script setup lang="ts">
import { NuInputHighlight, NuInputHorizontalRadioGroup } from '@nolebase/ui'
import { useLocalStorage, useMediaQuery, useMounted } from '@vueuse/core'
import { useRoute } from 'vitepress'
import { computed, inject, onMounted, ref, watch } from 'vue'

import MenuHelp from './MenuHelp.vue'
import MenuTitle from './MenuTitle.vue'

import { useLayoutAppearanceChangeAnimation } from '../../composables/animation'
import {
  InjectionKey,
  LayoutMode,
  LayoutSwitchModeStorageKey,
  supportedLayoutModes
} from '../../constants'

const options = inject(InjectionKey, {})

const menuTitleElementRef = ref<HTMLDivElement>()
const isMenuHelpPoppedUp = ref(false)
const disabled = ref(false)

const route = useRoute()
const mounted = useMounted()
const isLargerThanMobile = useMediaQuery('(min-width: 768px)')
const layoutMode = useLocalStorage<LayoutMode>(
  LayoutSwitchModeStorageKey,
  options.layoutSwitch?.defaultMode || LayoutMode.Original
)
const { trigger: triggerAnimation } = useLayoutAppearanceChangeAnimation()

const fieldOptions = computed(() => [
  {
    value: LayoutMode.FullWidth,
    title: 'Expand all',
    helpMessage:
      'The sidebar and content area occupy the entire width of the screen.',
    ariaLabel: 'Expand all',
    icon: 'i-icon-park-outline:full-screen-one',
    name: 'VitePress Nolebase Enhanced Readabilities Layout Mode Checkbox'
  },
  {
    value: LayoutMode.SidebarWidthAdjustableOnly,
    title: 'Expand sidebar with adjustable values',
    helpMessage:
      'Expand sidebar width and add a new slider for user to choose and customize their desired width of the maximum width of sidebar can go, but the content area width will remain the same.',
    ariaLabel: 'Expand sidebar with adjustable values',
    icon: 'i-icon-park-outline:full-screen-two',
    name: 'VitePress Nolebase Enhanced Readabilities Layout Mode Checkbox'
  },
  {
    value: LayoutMode.BothWidthAdjustable,
    title: 'Expand all with adjustable values',
    helpMessage:
      'Expand both sidebar and document content and add two new slider for user to choose and customize their desired width of the maximum width of either sidebar or document content can go.',
    ariaLabel: 'Expand all with adjustable values',
    icon: 'i-icon-park-outline:full-screen',
    name: 'VitePress Nolebase Enhanced Readabilities Layout Mode Checkbox'
  },
  {
    value: LayoutMode.Original,
    title: 'Original width',
    helpMessage:
      'Expand both sidebar and document content and add two new slider for user to choose and customize their desired width of the maximum width of either sidebar or document content can go.',
    ariaLabel: 'Original width',
    icon: 'i-icon-park-outline:overall-reduction',
    name: 'VitePress Nolebase Enhanced Readabilities Layout Mode Checkbox'
  }
])

function setClasses(val: LayoutMode, animated: boolean) {
  switch (val) {
    case LayoutMode.FullWidth:
      animated && triggerAnimation(document.body)
      document.body.classList.add(
        'VPNolebaseEnhancedReadabilitiesLayoutSwitchFullWidth'
      )
      document.body.classList.remove(
        'VPNolebaseEnhancedReadabilitiesLayoutSwitchSidebarWidthAdjustableOnly'
      )
      document.body.classList.remove(
        'VPNolebaseEnhancedReadabilitiesLayoutSwitchBothWidthAdjustable'
      )
      break
    case LayoutMode.SidebarWidthAdjustableOnly:
      animated && triggerAnimation(document.body)
      document.body.classList.remove(
        'VPNolebaseEnhancedReadabilitiesLayoutSwitchFullWidth'
      )
      document.body.classList.add(
        'VPNolebaseEnhancedReadabilitiesLayoutSwitchSidebarWidthAdjustableOnly'
      )
      document.body.classList.remove(
        'VPNolebaseEnhancedReadabilitiesLayoutSwitchBothWidthAdjustable'
      )
      break
    case LayoutMode.BothWidthAdjustable:
      animated && triggerAnimation(document.body)
      document.body.classList.remove(
        'VPNolebaseEnhancedReadabilitiesLayoutSwitchFullWidth'
      )
      document.body.classList.remove(
        'VPNolebaseEnhancedReadabilitiesLayoutSwitchSidebarWidthAdjustableOnly'
      )
      document.body.classList.add(
        'VPNolebaseEnhancedReadabilitiesLayoutSwitchBothWidthAdjustable'
      )
      break
    case LayoutMode.Original:
      animated && triggerAnimation(document.body)
      document.body.classList.remove(
        'VPNolebaseEnhancedReadabilitiesLayoutSwitchFullWidth'
      )
      document.body.classList.remove(
        'VPNolebaseEnhancedReadabilitiesLayoutSwitchSidebarWidthAdjustableOnly'
      )
      document.body.classList.remove(
        'VPNolebaseEnhancedReadabilitiesLayoutSwitchBothWidthAdjustable'
      )
      break
  }
}

watch(mounted, (val) => {
  if (!val) return

  setClasses(layoutMode.value, !options.layoutSwitch?.disableAnimation)
  if (!supportedLayoutModes.includes(layoutMode.value)) {
    layoutMode.value = options.layoutSwitch?.defaultMode ||
      LayoutMode.BothWidthAdjustable
  }
})

watch(layoutMode, (val) => {
  if (!mounted.value) return

  setClasses(val, !options.layoutSwitch?.disableAnimation)
  if (!supportedLayoutModes.includes(val)) {
    layoutMode.value = options.layoutSwitch?.defaultMode ||
      LayoutMode.BothWidthAdjustable
  }
})

watch(route, () => {
  setClasses(layoutMode.value, !options.layoutSwitch?.disableAnimation)
})

watch(isLargerThanMobile, () => {
  if (!isLargerThanMobile.value) disabled.value = true
})

onMounted(() => {
  if (!isLargerThanMobile.value) disabled.value = true
})
</script>

<template>
  <div space-y-2 role="radiogroup">
    <div ref="menuTitleElementRef" flex items-center>
      <MenuTitle
        title="Layout Switch"
        aria-label="Layout Switch"
        flex="1"
        :disabled="disabled"
        pr-4
      >
        <template #icon>
          <span i-icon-park-outline:layout-one mr-1 aria-hidden="true" />
        </template>
      </MenuTitle>
      <MenuHelp
        v-if="!options.layoutSwitch?.disableHelp"
        v-model:is-popped-up="isMenuHelpPoppedUp"
        :menu-title-element-ref="menuTitleElementRef"
      >
        <h4 text-md mb-1 font-semibold>Layout Switch</h4>
        <p text="sm" mb-2 max-w-100>
          <span>
            Adjust the layout style of VitePress to adapt to different reading
            needs and screens.
          </span>
        </p>
        <div space-y-2 class="VPNolebaseEnhancedReadabilitiesMenu">
          <div
            v-for="(option, index) in fieldOptions"
            :key="index"
            text="sm"
            bg="$vp-nolebase-enhanced-readabilities-menu-background-color"
            max-w-100
            rounded-xl
            p-3
          >
            <h5 text="sm" mb-2 flex="~" items-center align-middle>
              <span mr-1 :class="[option.icon]" />
              <span font-semibold>{{ option.title }}</span>
            </h5>
            <span>{{ option.helpMessage }}</span>
          </div>
        </div>
      </MenuHelp>
    </div>
    <NuInputHighlight :active="isMenuHelpPoppedUp" class="rounded-md">
      <NuInputHorizontalRadioGroup
        v-model="layoutMode"
        bg="$vp-nolebase-enhanced-readabilities-menu-background-color"
        text="sm $vp-nolebase-enhanced-readabilities-menu-text-color"
        :options="fieldOptions"
        :disabled="disabled"
      />
    </NuInputHighlight>
  </div>
</template>

<style less>
.VPNolebaseEnhancedReadabilitiesLayoutSwitchAnimated {
  /* with sidebar */
  .VPNavBar.has-sidebar > .wrapper > .container > .title {
    transition: width 0.5s ease-in-out, padding-left 0.5s ease-in-out;
  }

  /* without sidebar */
  .VPNavBar > .wrapper > .container > .title {
    transition: width 0.5s ease-in-out, padding-left 0.5s ease-in-out;
  }

  .VPNavBar > .wrapper > .container {
    transition: width 0.5s ease-in-out, max-width 0.5s ease-in-out;
  }

  /* with sidebar */
  .VPNavBar.has-sidebar > .wrapper > .container > .content,
  .VPNavBar > .wrapper > .container > .content {
    transition: padding-right 0.5s ease-in-out, padding-left 0.5s ease-in-out;
  }

  /* line below the nav */
  .VPNavBar.has-sidebar > .divider {
    transition: padding-left 0.5s ease-in-out, width 0.5s ease-in-out;
  }

  .VPSidebar {
    transition: width 0.5s ease-in-out, padding-left 0.5s ease-in-out;
  }

  .VPContent.has-sidebar {
    transition:
      width 0.5s ease-in-out,
      padding-left 0.5s ease-in-out,
      padding-right 0.5s ease-in-out;
  }

  .VPDoc .container {
    transition: width 0.5s ease-in-out, max-width 0.5s ease-in-out;
  }

  .VPDoc.has-aside .content-container {
    transition: width 0.5s ease-in-out, max-width 0.5s ease-in-out;
  }

  .VPDoc:not(.has-sidebar) .container {
    transition: width 0.5s ease-in-out, max-width 0.5s ease-in-out;
  }

  .VPDoc:not(.has-sidebar) .container > .content {
    transition: width 0.5s ease-in-out, max-width 0.5s ease-in-out;
  }
}

:root {
  --vp-nolebase-enhanced-readabilities-page-max-width: 100%;
  --vp-nolebase-enhanced-readabilities-content-max-width: 100%;
  --vp-nolebase-enhanced-readabilities-full-width-max-width: 100%;
}

.VPNolebaseEnhancedReadabilitiesLayoutSwitchFullWidth {
  @media (min-width: 1280px) {
    /* Overriding styles of navbar section */
    .VPNavBar.has-sidebar > .wrapper > .container > .title {
      padding-left: max(
        32px,
        calc(
          (
            100% -
              (
              var(--vp-nolebase-enhanced-readabilities-full-width-max-width) -
                64px
            )
          ) /
            2
        )
      ) !important;
      width: calc(
        (
          100% -
            (
            var(--vp-nolebase-enhanced-readabilities-full-width-max-width) -
              64px
          )
        ) /
          2 +
          var(--vp-sidebar-width) -
          32px
      ) !important;
    }

    .VPNavBar > .wrapper > .container,
    .VPNavBar.has-sidebar > .wrapper > .container {
      max-width: var(--vp-nolebase-enhanced-readabilities-full-width-max-width)
        !important;
    }

    .VPNavBar.has-sidebar > .wrapper > .container > .content {
      padding-left: max(32px, var(--vp-sidebar-width)) !important;
      width: 100% !important;
      padding-right: 32px !important;
    }

    /* Overriding styles of sidebar section */
    .VPSidebar {
      padding-left: max(
        32px,
        calc(
          (
            100% -
              (
              var(--vp-nolebase-enhanced-readabilities-full-width-max-width) -
                64px
            )
          ) /
            2
        )
      ) !important;
      width: calc(
        (
          100% -
            (
            var(--vp-nolebase-enhanced-readabilities-full-width-max-width) -
              64px
          )
        ) /
          2 +
          var(--vp-sidebar-width) -
          32px
      ) !important;
    }

    /* Overriding styles of document section */
    .VPContent.has-sidebar {
      padding-left: calc(
        (
          100vw - var(--vp-nolebase-enhanced-readabilities-full-width-max-width)
        ) /
          2 +
          var(--vp-sidebar-width)
      ) !important;
      padding-right: calc(
        (
          100vw - var(--vp-nolebase-enhanced-readabilities-full-width-max-width)
        ) /
          2
      ) !important;
    }

    .VPDoc.has-aside div.content-container {
      max-width: var(--vp-nolebase-enhanced-readabilities-full-width-max-width);
    }

    .VPDoc:not(.has-sidebar) .container {
      max-width: var(--vp-nolebase-enhanced-readabilities-full-width-max-width);
    }

    .VPDoc:not(.has-sidebar) .container > .content {
      max-width: var(--vp-nolebase-enhanced-readabilities-full-width-max-width);
    }
  }

  @media (min-width: 1440px) {
    .VPNavBar > .wrapper > .container {
      max-width: var(--vp-nolebase-enhanced-readabilities-full-width-max-width);
    }

    .VPNavBar.has-sidebar > .divider {
      padding-left: calc(
        (
          100vw - var(--vp-nolebase-enhanced-readabilities-full-width-max-width)
        ) /
          2 +
          var(--vp-sidebar-width)
      ) !important;
    }
  }

  @media (min-width: 1536px) {
    .VPNavBar > .wrapper > .container {
      max-width: var(--vp-nolebase-enhanced-readabilities-full-width-max-width);
    }

    .VPDoc .container {
      max-width: var(--vp-nolebase-enhanced-readabilities-full-width-max-width);
    }
  }
}

.VPNolebaseEnhancedReadabilitiesLayoutSwitchSidebarWidthAdjustableOnly {
  @media (min-width: 1280px) {
    /* Overriding styles of navbar section */
    .VPNavBar.has-sidebar > .wrapper > .container > .title {
      padding-left: max(
        32px,
        calc(
          (
            100% -
              (
              var(--vp-nolebase-enhanced-readabilities-page-max-width) - 64px
            )
          ) /
            2
        )
      ) !important;
      width: calc(
        (
          100% -
            (
            var(--vp-nolebase-enhanced-readabilities-page-max-width) - 64px
          )
        ) /
          2 +
          var(--vp-sidebar-width) -
          32px
      ) !important;
    }

    .VPNavBar > .wrapper > .container,
    .VPNavBar.has-sidebar > .wrapper > .container {
      max-width: var(--vp-nolebase-enhanced-readabilities-page-max-width)
        !important;
    }

    .VPNavBar.has-sidebar > .wrapper > .container > .content {
      padding-left: max(32px, calc(var(--vp-sidebar-width))) !important;
      width: 100% !important;
      padding-right: 32px !important;
    }

    /* Overriding styles of sidebar section */
    .VPSidebar {
      padding-left: max(
        32px,
        calc(
          (
            100% -
              (
              var(--vp-nolebase-enhanced-readabilities-page-max-width) - 64px
            )
          ) /
            2
        )
      ) !important;
      width: calc(
        (
          100% -
            (
            var(--vp-nolebase-enhanced-readabilities-page-max-width) - 64px
          )
        ) /
          2 +
          var(--vp-sidebar-width) -
          32px
      ) !important;
    }
  }

  @media (min-width: 1440px) {
    .VPNavBar > .wrapper > .container,
    .VPNavBar.has-sidebar > .wrapper > .container {
      max-width: var(--vp-nolebase-enhanced-readabilities-page-max-width)
        !important;
    }

    .VPNavBar.has-sidebar > .divider {
      padding-left: calc(
        (100vw - var(--vp-nolebase-enhanced-readabilities-page-max-width)) / 2 +
          var(--vp-sidebar-width)
      ) !important;
    }

    .VPContent.has-sidebar {
      padding-left: calc(
        (
          100vw - var(--vp-nolebase-enhanced-readabilities-content-max-width)
        ) /
          2 +
          var(--vp-sidebar-width)
      ) !important;
      padding-right: calc(
        (
          100vw - var(--vp-nolebase-enhanced-readabilities-content-max-width)
        ) /
          2
      ) !important;
    }
  }
}

.VPNolebaseEnhancedReadabilitiesLayoutSwitchBothWidthAdjustable {
  @media (min-width: 1280px) {
    /* Overriding styles of navbar section */
    .VPNavBar.has-sidebar > .wrapper > .container > .title {
      padding-left: max(
        32px,
        calc(
          (
            100% -
              (
              var(--vp-nolebase-enhanced-readabilities-page-max-width) - 64px
            )
          ) /
            2
        )
      ) !important;
      width: calc(
        (
          100% -
            (
            var(--vp-nolebase-enhanced-readabilities-page-max-width) - 64px
          )
        ) /
          2 +
          var(--vp-sidebar-width) -
          32px
      ) !important;
    }

    .VPNavBar > .wrapper > .container,
    .VPNavBar.has-sidebar > .wrapper > .container {
      max-width: var(--vp-nolebase-enhanced-readabilities-page-max-width)
        !important;
    }

    .VPNavBar.has-sidebar > .wrapper > .container > .content {
      padding-left: max(32px, var(--vp-sidebar-width)) !important;
      width: 100% !important;
      padding-right: 32px !important;
    }

    /* Overriding styles of sidebar section */
    .VPSidebar {
      padding-left: max(
        32px,
        calc(
          (
            100% -
              (
              var(--vp-nolebase-enhanced-readabilities-page-max-width) - 64px
            )
          ) /
            2
        )
      ) !important;
      width: calc(
        (
          100% -
            (
            var(--vp-nolebase-enhanced-readabilities-page-max-width) - 64px
          )
        ) /
          2 +
          var(--vp-sidebar-width) -
          32px
      ) !important;
    }

    .VPDoc.has-aside .content-container {
      max-width: var(--vp-nolebase-enhanced-readabilities-content-max-width);
    }

    .VPDoc:not(.has-sidebar) .container {
      max-width: var(--vp-nolebase-enhanced-readabilities-content-max-width);
    }

    .VPDoc:not(.has-sidebar) .container > .content {
      max-width: var(--vp-nolebase-enhanced-readabilities-content-max-width);
    }
  }

  @media (min-width: 1440px) {
    .VPNavBar > .wrapper > .container,
    .VPNavBar.has-sidebar > .wrapper > .container {
      max-width: var(--vp-nolebase-enhanced-readabilities-page-max-width)
        !important;
    }

    .VPNavBar.has-sidebar > .divider {
      padding-left: calc(
        (100vw - var(--vp-nolebase-enhanced-readabilities-page-max-width)) / 2 +
          var(--vp-sidebar-width)
      ) !important;
    }

    .VPContent.has-sidebar {
      padding-left: calc(
        (
          100vw - var(--vp-nolebase-enhanced-readabilities-content-max-width)
        ) /
          2 +
          var(--vp-sidebar-width)
      ) !important;
      padding-right: calc(
        (
          100vw - var(--vp-nolebase-enhanced-readabilities-content-max-width)
        ) /
          2
      ) !important;
    }
  }

  @media (min-width: 1536px) {
    .VPNavBar > .wrapper > .container,
    .VPNavBar.has-sidebar > .wrapper > .container {
      max-width: var(--vp-nolebase-enhanced-readabilities-page-max-width)
        !important;
    }

    .VPDoc .container {
      max-width: var(--vp-nolebase-enhanced-readabilities-content-max-width);
    }
  }
}
</style>
