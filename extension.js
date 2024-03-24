/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

import GLib from 'gi://GLib';
import * as ModalDialog from 'resource:///org/gnome/shell/ui/modalDialog.js';
import {EndSessionDialog} from 'resource:///org/gnome/shell/ui/endSessionDialog.js';
import {Extension, InjectionManager} from 'resource:///org/gnome/shell/extensions/extension.js';

import DialogContent from './DialogContent.js';

let timeoutId;

export default class EndSessionTimer extends Extension {
    enable() {
        this._injectionManager = new InjectionManager();

        // override _startTimer method
        this._injectionManager.overrideMethod(EndSessionDialog.prototype, '_startTimer',
            () => {
                const settings = this.getSettings();
                return function () {
                    this._totalSecondsToStayOpen = settings.get_int('timeout');
                    let startTime = GLib.get_monotonic_time();
                    this._secondsLeft = this._totalSecondsToStayOpen;

                    timeoutId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 1, () => {
                        let currentTime = GLib.get_monotonic_time();
                        let secondsElapsed = (currentTime - startTime) / 1000000;

                        this._secondsLeft = this._totalSecondsToStayOpen - secondsElapsed;
                        if (this._secondsLeft > 0) {
                            this._sync();
                            return GLib.SOURCE_CONTINUE;
                        }

                        let dialogContent = DialogContent[this._type];
                        let button = dialogContent.confirmButtons[dialogContent.confirmButtons.length - 1];
                        this._confirm(button.signal).catch(logError);
                        timeoutId = 0;
                    });
                    GLib.Source.set_name_by_id(this._timerId, '[gnome-shell] this._confirm');
                };
            }
        );

        // override _sync method
        this._injectionManager.overrideMethod(EndSessionDialog.prototype, '_sync',
            () => {
                return function () {
                    let open = this.state === ModalDialog.State.OPENING || this.state === ModalDialog.State.OPENED;
                    if (!open)
                        return;

                    let dialogContent = DialogContent[this._type];

                    let subject = dialogContent.subject;

                    if (dialogContent.subjectWithUpdates && this._checkBox.checked)
                        subject = dialogContent.subjectWithUpdates;

                    this._batteryWarning.visible = this._shouldShowLowBatteryWarning(dialogContent);

                    let description;
                    let displayTime = Math.ceil(this._secondsLeft);

                    if (this._user.is_loaded) {
                        let realName = this._user.get_real_name();

                        if (realName != null) {
                            if (dialogContent.subjectWithUser)
                                subject = dialogContent.subjectWithUser.format(realName);

                            if (dialogContent.descriptionWithUser)
                                description = dialogContent.descriptionWithUser(realName, displayTime);
                        }
                    }

                    if (dialogContent.upgradeDescription) {
                        const {name, version} = this._updateInfo.PreparedUpgrade;
                        if (name != null && version != null)
                            description = dialogContent.upgradeDescription(name, version);
                    }

                    if (!description)
                        description = dialogContent.description(displayTime);

                    this._messageDialogContent.title = subject;
                    this._messageDialogContent.description = description;

                    let hasApplications = this._applications.length > 0;
                    let hasSessions = this._sessions.length > 0;

                    this._applicationSection.visible = hasApplications;
                    this._sessionSection.visible = hasSessions;
                };
            }
        );
    }

    disable() {
        // clear timeout
        if (timeoutId) {
            GLib.Source.remove(timeoutId);
            timeoutId = null;
        }

        this._injectionManager.clear(); // clear override methods
        this._injectionManager = null;
    }
}
