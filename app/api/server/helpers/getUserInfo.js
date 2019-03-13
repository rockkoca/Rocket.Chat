import { settings } from '/app/settings';
import { getUserPreference } from '/app/utils';
import { API } from '../api';

const getInfoFromUserObject = (user) => {
	const {
		_id,
		name,
		emails,
		status,
		statusConnection,
		username,
		utcOffset,
		active,
		language,
		roles,
		settings,
		customFields,
	} = user;
	return {
		_id,
		name,
		emails,
		status,
		statusConnection,
		username,
		utcOffset,
		active,
		language,
		roles,
		settings,
		customFields,
	};
};


API.helperMethods.set('getUserInfo', function _getUserInfo(user) {
	const me = getInfoFromUserObject(user);
	const isVerifiedEmail = () => {
		if (me && me.emails && Array.isArray(me.emails)) {
			return me.emails.find((email) => email.verified);
		}
		return false;
	};
	const getUserPreferences = () => {
		const defaultUserSettingPrefix = 'Accounts_Default_User_Preferences_';
		const allDefaultUserSettings = settings.get(new RegExp(`^${ defaultUserSettingPrefix }.*$`));

		return allDefaultUserSettings.reduce((accumulator, setting) => {
			const settingWithoutPrefix = setting.key.replace(defaultUserSettingPrefix, ' ').trim();
			accumulator[settingWithoutPrefix] = getUserPreference(user, settingWithoutPrefix);
			return accumulator;
		}, {});
	};
	const verifiedEmail = isVerifiedEmail();
	me.email = verifiedEmail ? verifiedEmail.address : undefined;
	me.settings = {
		preferences: getUserPreferences(),
	};

	return me;
});