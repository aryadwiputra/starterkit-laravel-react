import LocaleController from './LocaleController'
import UserController from './UserController'
import RoleController from './RoleController'
import ImpersonationController from './ImpersonationController'
import ColumnPreferenceController from './ColumnPreferenceController'
import Settings from './Settings'
import NotificationsController from './NotificationsController'

const Controllers = {
    LocaleController: Object.assign(LocaleController, LocaleController),
    UserController: Object.assign(UserController, UserController),
    RoleController: Object.assign(RoleController, RoleController),
    ImpersonationController: Object.assign(ImpersonationController, ImpersonationController),
    ColumnPreferenceController: Object.assign(ColumnPreferenceController, ColumnPreferenceController),
    Settings: Object.assign(Settings, Settings),
    NotificationsController: Object.assign(NotificationsController, NotificationsController),
}

export default Controllers