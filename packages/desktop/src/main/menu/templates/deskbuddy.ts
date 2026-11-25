import { app, type BrowserWindow, type MenuItemConstructorOptions } from 'electron'
import { showAboutDialog } from '../actions/help'
import * as actions from '../actions/deskbuddy'
import { t } from '../../i18n'
import type Keybindings from '../../keyboard/shortcutHandler'

// macOS only menu.

export default function(keybindings: Keybindings): MenuItemConstructorOptions {
  return {
    label: t('menu.deskbuddy.title'),
    submenu: [
      {
        label: t('menu.deskbuddy.about'),
        click(_menuItem, focusedWindow) {
          showAboutDialog(focusedWindow as BrowserWindow | undefined)
        }
      },
      {
        label: t('menu.deskbuddy.checkUpdates'),
        click(_menuItem, focusedWindow) {
          actions.checkUpdates((focusedWindow as BrowserWindow | undefined) ?? null)
        }
      },
      {
        label: t('menu.deskbuddy.preferences'),
        accelerator: keybindings.getAccelerator('file.preferences') ?? undefined,
        click() {
          actions.userSetting()
        }
      },
      {
        type: 'separator'
      },
      {
        label: t('menu.deskbuddy.services'),
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        label: t('menu.deskbuddy.hide'),
        accelerator: keybindings.getAccelerator('mt.hide') ?? undefined,
        click() {
          actions.osxHide()
        }
      },
      {
        label: t('menu.deskbuddy.hideOthers'),
        accelerator: keybindings.getAccelerator('mt.hide-others') ?? undefined,
        click() {
          actions.osxHideAll()
        }
      },
      {
        label: t('menu.deskbuddy.showAll'),
        click() {
          actions.osxShowAll()
        }
      },
      {
        type: 'separator'
      },
      {
        label: t('menu.deskbuddy.quit'),
        accelerator: keybindings.getAccelerator('file.quit') ?? undefined,
        click: app.quit
      }
    ]
  }
}
