import UserController from './UserController'
import RoleController from './RoleController'
import ImpersonationController from './ImpersonationController'
import ColumnPreferenceController from './ColumnPreferenceController'
import Settings from './Settings'

const Controllers = {
    UserController: Object.assign(UserController, UserController),
    RoleController: Object.assign(RoleController, RoleController),
    ImpersonationController: Object.assign(ImpersonationController, ImpersonationController),
    ColumnPreferenceController: Object.assign(ColumnPreferenceController, ColumnPreferenceController),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers