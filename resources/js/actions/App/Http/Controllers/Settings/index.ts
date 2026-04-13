import ProfileController from './ProfileController'
import SecurityController from './SecurityController'
import AppSettingsController from './AppSettingsController'
import MailSettingsController from './MailSettingsController'
import FeatureFlagsController from './FeatureFlagsController'

const Settings = {
    ProfileController: Object.assign(ProfileController, ProfileController),
    SecurityController: Object.assign(SecurityController, SecurityController),
    AppSettingsController: Object.assign(AppSettingsController, AppSettingsController),
    MailSettingsController: Object.assign(MailSettingsController, MailSettingsController),
    FeatureFlagsController: Object.assign(FeatureFlagsController, FeatureFlagsController),
}

export default Settings