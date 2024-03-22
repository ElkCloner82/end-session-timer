export const logoutDialogContent = {
    subjectWithUser: C_('title', 'Log Out %s'),
    subject: C_('title', 'Log Out'),
    descriptionWithUser(user, seconds) {
        return ngettext(
            '%s will be logged out automatically in %d second.',
            '%s will be logged out automatically in %d seconds.',
            seconds).format(user, seconds);
    },
    description(seconds) {
        return ngettext(
            'You will be logged out automatically in %d second.',
            'You will be logged out automatically in %d seconds.',
            seconds).format(seconds);
    },
    showBatteryWarning: false,
    confirmButtons: [{
        signal: 'ConfirmedLogout',
        label: C_('button', 'Log Out'),
    }],
    showOtherSessions: false,
};

export const shutdownDialogContent = {
    subject: C_('title', 'Power Off'),
    subjectWithUpdates: C_('title', 'Install Updates & Power Off'),
    description(seconds) {
        return ngettext(
            'The system will power off automatically in %d second.',
            'The system will power off automatically in %d seconds.',
            seconds).format(seconds);
    },
    checkBoxText: C_('checkbox', 'Install pending software updates'),
    showBatteryWarning: true,
    confirmButtons: [{
        signal: 'ConfirmedShutdown',
        label: C_('button', 'Power Off'),
    }],
    iconName: 'system-shutdown-symbolic',
    showOtherSessions: true,
};

export const restartDialogContent = {
    subject: C_('title', 'Restart'),
    subjectWithUpdates: C_('title', 'Install Updates & Restart'),
    description(seconds) {
        return ngettext(
            'The system will restart automatically in %d second.',
            'The system will restart automatically in %d seconds.',
            seconds).format(seconds);
    },
    checkBoxText: C_('checkbox', 'Install pending software updates'),
    showBatteryWarning: true,
    confirmButtons: [{
        signal: 'ConfirmedReboot',
        label: C_('button', 'Restart'),
    }],
    iconName: 'view-refresh-symbolic',
    showOtherSessions: true,
};

export const restartUpdateDialogContent = {

    subject: C_('title', 'Restart & Install Updates'),
    description(seconds) {
        return ngettext(
            'The system will automatically restart and install updates in %d second.',
            'The system will automatically restart and install updates in %d seconds.',
            seconds).format(seconds);
    },
    showBatteryWarning: true,
    confirmButtons: [{
        signal: 'ConfirmedReboot',
        label: C_('button', 'Restart & Install'),
    }],
    unusedFutureButtonForTranslation: C_('button', 'Install & Power Off'),
    unusedFutureCheckBoxForTranslation: C_('checkbox', 'Power off after updates are installed'),
    iconName: 'view-refresh-symbolic',
    showOtherSessions: true,
};

export const restartUpgradeDialogContent = {

    subject: C_('title', 'Restart & Install Upgrade'),
    upgradeDescription(distroName, distroVersion) {
        return _('%s %s will be installed after restart. Upgrade installation can take a long time: ensure that you have backed up and that the computer is plugged in.').format(distroName, distroVersion);
    },
    disableTimer: true,
    showBatteryWarning: false,
    confirmButtons: [{
        signal: 'ConfirmedReboot',
        label: C_('button', 'Restart & Install'),
    }],
    iconName: 'view-refresh-symbolic',
    showOtherSessions: true,
};

export const DialogType = {
    LOGOUT: 0,
    SHUTDOWN: 1,
    RESTART: 2,
    UPDATE_RESTART: 3,
    UPGRADE_RESTART: 4,
};

export const DialogContent = {
    0: logoutDialogContent,
    1: shutdownDialogContent,
    2: restartDialogContent,
    3: restartUpdateDialogContent,
    4: restartUpgradeDialogContent,
};
