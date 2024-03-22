import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';

import {ExtensionPreferences} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class EndSessionTimerExtensionPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        window._settings = this.getSettings();

        const timeout = () => {
            let hbox = new Gtk.Box({orientation: Gtk.Orientation.HORIZONTAL, margin_top: 5});
            let timeoutLabel = new Gtk.Label({label: 'Set timeout in seconds', xalign: 0, hexpand: true});

            this._timeoutAdjustment = new Gtk.Adjustment({
                lower: 5,
                'step-increment': 1,
                'page-increment': 5,
                upper: 60,
            });

            this._timeoutScale = new Gtk.Scale({
                hexpand: true,
                margin_start: 20,
                visible: true,
                'draw-value': true,
                'value-pos': 'left',
                'can-focus': true,
                digits: 0,
                adjustment: this._timeoutAdjustment,
            });

            this._timeoutScale.set_value(window._settings.get_int('timeout'));
            this._timeoutScale.connect('value-changed', entry => {
                window._settings.set_int('timeout', entry.get_value());
            });

            hbox.append(timeoutLabel);
            hbox.append(this._timeoutScale);

            return hbox;
        };

        const page = new Adw.PreferencesPage();
        window.add(page);

        const group = new Adw.PreferencesGroup();
        page.add(group);

        group.add(timeout());
    }
}
