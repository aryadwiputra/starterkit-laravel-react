import ProfileController from './ProfileController'
import SettingsHomeController from './SettingsHomeController'
import SecurityController from './SecurityController'
import AppSettingsController from './AppSettingsController'
import MailSettingsController from './MailSettingsController'
import FeatureFlagsController from './FeatureFlagsController'

const Settings = {
    ProfileController: Object.assign(ProfileController, ProfileController),
    SettingsHomeController: Object.assign(SettingsHomeController, SettingsHomeController),
    SecurityController: Object.assign(SecurityController, SecurityController),
    AppSettingsController: Object.assign(AppSettingsController, AppSettingsController),
    MailSettingsController: Object.assign(MailSettingsController, MailSettingsController),
    FeatureFlagsController: Object.assign(FeatureFlagsController, FeatureFlagsController),
}

export default Settings