import HealthController from './HealthController'
import V1 from './V1'

const Api = {
    HealthController: Object.assign(HealthController, HealthController),
    V1: Object.assign(V1, V1),
}

export default Api