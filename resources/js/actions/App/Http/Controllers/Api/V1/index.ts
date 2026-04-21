import AuthTokenController from './AuthTokenController'
import MeController from './MeController'

const V1 = {
    AuthTokenController: Object.assign(AuthTokenController, AuthTokenController),
    MeController: Object.assign(MeController, MeController),
}

export default V1